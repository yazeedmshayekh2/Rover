from flask import Flask, render_template, request, jsonify
from transformers import Qwen2_5_VLForConditionalGeneration, AutoProcessor
from qwen_vl_utils import process_vision_info
import torch
import base64
from PIL import Image
import io
import os
import re
import gc
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize model and processor
def load_model():
    # Clear cuda cache before loading model
    torch.cuda.empty_cache()
    gc.collect()
    
    # Set memory efficient settings
    if torch.cuda.is_available():
        torch.cuda.set_per_process_memory_fraction(0.8)  # Use only 80% of GPU memory
    
    model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
        "unsloth/Qwen2.5-VL-7B-Instruct-unsloth-bnb-4bit",
        torch_dtype=torch.bfloat16,
        device_map="auto",
        low_cpu_mem_usage=True
    )
    processor = AutoProcessor.from_pretrained("Qwen/Qwen2.5-VL-7B-Instruct")
    return model, processor

# Load model globally
print("Loading model...")
model, processor = load_model()
print("Model loaded successfully!")

# Store the last extracted text for JSON download
last_extracted_text = {}

def format_extracted_text(text):
    """Format the extracted text to make it more readable and visually appealing"""
    # Clean up any empty lines at the beginning
    text = text.strip()
    
    # Store original text and prompt for JSON download
    global last_extracted_text
    prompt_used = last_extracted_text.get("prompt_used", "")
    last_extracted_text = {
        "full_text": text,
        "prompt_used": prompt_used
    }
    
    # Try to detect if it's a tabular/card format (like an ID card)
    if re.search(r'(\d+\.\s.*?:|\bID\b|\bCard\b|\bPassport\b)', text, re.IGNORECASE):
        return format_as_card(text)
    else:
        return format_as_regular_text(text)

def format_as_card(text):
    """Format text that appears to be ID card or similar structured data"""
    # Extract the title if present (usually the first line)
    title_match = re.match(r'^(.*?)(?:\n|$)', text)
    title = title_match.group(1) if title_match else "Extracted Information"
    
    # Create a card-like structure
    html = f'<div class="card-document">'
    html += f'<div class="card-header-blue"><h3>Extracted Text</h3><button id="download-json" class="btn-icon-white"><i class="fas fa-download"></i></button></div>'
    html += f'<div class="card-body-light">'
    html += f'<p>Here is the extracted text from the image:</p>'
    
    # Create an inner card with blue background for content
    html += f'<div class="inner-card">'
    
    # Process the text line by line
    lines = text.split('\n')
    processed_lines = []
    
    # Try to extract structured data for JSON
    structured_data = {}
    
    # Look for possible ID card pattern
    is_id_card = bool(re.search(r'(ID|Identity|Card|National|Passport|citizenship)', title, re.IGNORECASE))
    
    # Process each line, looking for numbered items or key-value pairs
    for line in lines:
        # Skip empty lines
        if not line.strip():
            continue
            
        # Check for numbered items - common in ID cards (1. Name: John Doe)
        numbered_match = re.match(r'(\d+)\.\s+(.*?)(?::\s*(.*))?$', line)
        if numbered_match:
            num, key, value = numbered_match.groups()
            num_span = f'<span class="number">{num}.</span>'
            
            if value:  # If it's a key-value pair
                key_span = f'<span class="key">{key}:</span>'
                # Add direction auto for better RTL text handling
                value_span = f'<span class="value" dir="auto">{value}</span>'
                processed_lines.append(f'<div class="id-card-row">{num_span} {key_span} {value_span}</div>')
                structured_data[key] = value
            else:  # Just a numbered item
                key_span = f'<span class="text" dir="auto">{key}</span>'
                processed_lines.append(f'<div class="id-card-row">{num_span} {key_span}</div>')
                structured_data[f"item_{num}"] = key
        else:
            # Try to match key-value pairs without numbers (Name: John Doe)
            kv_match = re.match(r'(.*?):\s*(.*)$', line)
            if kv_match:
                key, value = kv_match.groups()
                key_span = f'<span class="key">{key}:</span>'
                value_span = f'<span class="value" dir="auto">{value}</span>'
                processed_lines.append(f'<div class="id-card-row">{key_span} {value_span}</div>')
                structured_data[key] = value
            else:
                # Regular text
                processed_lines.append(f'<div class="id-card-row"><span class="text" dir="auto">{line}</span></div>')
    
    # Store structured data for JSON download
    global last_extracted_text
    prompt_used = last_extracted_text.get("prompt_used", "")
    last_extracted_text = {
        "full_text": text,
        "structured_data": structured_data,
        "prompt_used": prompt_used,
        "document_type": "id_card" if is_id_card else "tabular_data"
    }
    
    # Join the processed lines
    html += '<div class="card-content">' + ''.join(processed_lines) + '</div>'
    
    # Add some CSS for better ID card display
    if is_id_card:
        html += '''
        <style>
        .id-card-row {
            margin-bottom: 10px;
            padding: 5px;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .id-card-row:last-child {
            border-bottom: none;
        }
        .value {
            font-weight: 500;
        }
        [dir="auto"] {
            unicode-bidi: isolate;
        }
        </style>
        '''
    
    # Close the divs
    html += '</div></div></div>'
    
    return html

def format_as_regular_text(text):
    """Format regular non-tabular text with proper HTML structure"""
    # Format section titles/headers
    text = re.sub(r'([A-Z][A-Z\s]+:)', r'<h3 class="section-title">\1</h3>', text)
    
    # Format numbered lists - add proper list styling
    text = re.sub(r'(\d+\.\s)(.*?)(?=\n\d+\.|\n\n|\n*$)', 
                 r'<div class="list-item"><span class="list-number">\1</span>\2</div>', 
                 text, flags=re.DOTALL)
    
    # Format bullets or dashes as list items
    text = re.sub(r'([-•*]\s)(.*?)(?=\n[-•*]|\n\n|\n*$)', 
                 r'<div class="list-item"><span class="list-bullet">\1</span>\2</div>', 
                 text, flags=re.DOTALL)
    
    # Format key-value pairs (like "Name: John" or "Phone: 123-456-7890")
    text = re.sub(r'(?<!\<h3 class=\"section-title\">)([A-Za-z]+\s*:)\s*(.*?)(?=\n[A-Za-z]+\s*:|\n\n|\n*$)', 
                 r'<div class="key-value"><span class="key">\1</span><span class="value">\2</span></div>', 
                 text, flags=re.DOTALL)
    
    # Format paragraph text - add paragraph tags to text blocks that aren't already specially formatted
    paragraphs = []
    for line in text.split('\n\n'):
        if not (line.startswith('<h3') or line.startswith('<div class="list-item"') or 
                line.startswith('<div class="key-value"')):
            if line.strip():  # If not empty
                paragraphs.append(f'<p>{line.strip()}</p>')
        else:
            paragraphs.append(line)
    
    # Join everything with appropriate spacing
    formatted_text = '\n'.join(paragraphs)
    
    # Add a download button and wrap in styled container
    formatted_text = f'''
    <div class="card-document">
        <div class="card-header-blue">
            <h3>Extracted Text</h3>
            <button id="download-json" class="btn-icon-white"><i class="fas fa-download"></i></button>
        </div>
        <div class="card-body-light">
            <div class="extracted-content">
                {formatted_text}
            </div>
        </div>
    </div>
    '''
    
    return formatted_text

def extract_text(image, prompt=None):
    """Extract text from image using the VL model with specialized prompts based on image content"""
    # Clear CUDA cache before processing
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        gc.collect()
    
    # Convert PIL Image to content to be used in messages
    if isinstance(image, Image.Image):
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        image_content = f"data:image/jpeg;base64,{img_str}"
    else:
        image_content = image
    
    # If no specific prompt is provided, first determine the document type
    if not prompt or prompt.strip() == "":
        # Create a message to analyze the document type
        analyze_messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "image": image_content
                    },
                    {"type": "text", "text": "What type of document is this? If it's an ID card, specify if it's the front or back side. Just answer with: ID FRONT, ID BACK, or specify another document type."}
                ]
            }
        ]
        
        try:
            # Prepare inputs for document analysis
            analyze_text = processor.apply_chat_template(analyze_messages, tokenize=False, add_generation_prompt=True)
            analyze_image_inputs, _ = process_vision_info(analyze_messages)
            analyze_inputs = processor(
                text=[analyze_text],
                images=analyze_image_inputs,
                videos=None,
                padding=True,
                return_tensors="pt"
            )
            analyze_inputs = analyze_inputs.to("cuda" if torch.cuda.is_available() else "cpu")
            
            # Get document type
            with torch.no_grad():
                analyze_generated_ids = model.generate(
                    **analyze_inputs, 
                    max_new_tokens=50,
                    do_sample=False,
                )
            
            analyze_output = processor.batch_decode(
                [out_ids[len(in_ids):] for in_ids, out_ids in zip(analyze_inputs.input_ids, analyze_generated_ids)],
                skip_special_tokens=True,
                clean_up_tokenization_spaces=False
            )[0].strip().lower()
            
            # Clear memory after analysis
            del analyze_inputs, analyze_generated_ids
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                gc.collect()
            
            # Choose the appropriate specialized prompt based on document type
            if "id front" in analyze_output:
                prompt = """Extract all text from the front of this ID card systematically. Format as follows:
1. Name (in Arabic and English if available)
2. ID Number
3. Gender
4. Date of Birth
5. Place of Birth
6. Mother's Name

Present each field in both Arabic and English if available. Format as a clean numbered list with clear labels. If any field is not visible or unclear, mark it as [Not Found]."""

            elif "id back" in analyze_output:
                prompt = """Extract all text from the back of this ID card systematically. Format as follows:
1. مكان ورقم القيد (Civil Registry Number and Place)
2. الصلاحية (Expiry Date)
3. مكان الاصدار (Place of Issue)
4. مكان الاقامة (Place of Residence)
5. فصيلة الدم (Blood Type)
6. ID Number
7. Additional Information

Present each field in both Arabic and English if available. Format as a clean numbered list with clear labels. If any field is not visible or unclear, mark it as [Not Found]."""

            elif "receipt" in analyze_output or "invoice" in analyze_output:
                prompt = "Extract all text from this receipt. Include store name, date, all items with prices, subtotal, tax, and total. Format as a clean list with prices aligned."
            
            elif "business" in analyze_output and "card" in analyze_output:
                prompt = "Extract all information from this business card including: name, title, company, address, phone number, email, and website. Format as key-value pairs."
            
            elif "form" in analyze_output:
                prompt = "Extract all fields and their values from this form. Present as key-value pairs and preserve the form structure. Include all text, labels, and values."
            
            elif "table" in analyze_output or "spreadsheet" in analyze_output:
                prompt = "Extract this table data preserving its structure. Maintain column alignment and present values in their respective rows and columns. Preserve headers and cell values."
            
            elif "handwritten" in analyze_output:
                prompt = "Carefully transcribe all handwritten text from this image. Preserve paragraph breaks and formatting. If any text is unclear, indicate with [unclear]."
            
            else:
                # Default comprehensive prompt
                prompt = "Extract all text visible in this image. Preserve the original structure and formatting. For any tables, maintain alignment. For forms or cards, present as key-value pairs. Number items if they appear in a list."
        
        except Exception as e:
            # If analysis fails, use a general purpose prompt
            prompt = "Extract all text visible in this image. Preserve the structure and formatting of the content."
            print(f"Document analysis error: {e}. Using default prompt.")
    
    # Prepare the final message format with the specialized or provided prompt
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "image": image_content
                },
                {"type": "text", "text": prompt}
            ]
        }
    ]
    
    try:
        # Prepare inputs
        text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        image_inputs, video_inputs = process_vision_info(messages)
        inputs = processor(
            text=[text],
            images=image_inputs,
            videos=None,  # Set videos to None to avoid errors
            padding=True,
            return_tensors="pt"
        )
        inputs = inputs.to("cuda" if torch.cuda.is_available() else "cpu")
        
        # Store the prompt used for reference
        global last_extracted_text
        last_extracted_text = {"prompt_used": prompt}
        
        # Generate output with memory-efficient settings
        with torch.no_grad():
            generated_ids = model.generate(
                **inputs, 
                max_new_tokens=512,
                do_sample=False,  # Deterministic generation uses less memory
            )
        
        generated_ids_trimmed = [out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)]
        output_text = processor.batch_decode(
            generated_ids_trimmed,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=False
        )
        
        # Format the extracted text
        formatted_text = format_extracted_text(output_text[0])
        
        # No need to replace newlines with <br> anymore since we're using proper HTML formatting
        
        # Clear cache after processing
        del inputs, generated_ids, generated_ids_trimmed
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            gc.collect()
        
        return formatted_text
    
    except Exception as e:
        # Clear cache if there's an error
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            gc.collect()
        raise e

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/extract', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    
    prompt = request.form.get('prompt', "")
    
    try:
        # Process the image
        image = Image.open(file).convert('RGB')
        
        # Resize large images to reduce memory usage
        max_size = 1280  # Maximum dimension
        if max(image.size) > max_size:
            ratio = max_size / max(image.size)
            new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
            image = image.resize(new_size, Image.LANCZOS)
        
        result = extract_text(image, prompt)
        
        # Clear memory after processing
        del image
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            gc.collect()
            
        return jsonify({'result': result})
    except Exception as e:
        # Clear memory in case of error
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            gc.collect()
        return jsonify({'error': str(e)}), 500

# Add route to download JSON data
@app.route('/download_json', methods=['GET'])
def download_json():
    global last_extracted_text
    return jsonify(last_extracted_text)

# Add route to manually clear cache
@app.route('/clear_cache', methods=['POST'])
def clear_cache():
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        gc.collect()
    return jsonify({'message': 'Cache cleared successfully'})

if __name__ == '__main__':
    # Ensure templates and static directories exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    
    app.run(host='0.0.0.0', port=8000, debug=True) 