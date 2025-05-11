# OCR System with React Frontend and Flask Backend

An OCR (Optical Character Recognition) system that uses the Qwen2.5-VL model to extract text from images. The system includes a modern, interactive React frontend with 3D models and a Flask backend for image processing.

## Features

- Text extraction from various document types (ID cards, receipts, forms, etc.)
- Specialized prompts for different document formats
- Interactive 3D visualizations using Three.js and React Three Fiber
- Responsive UI design with animation effects

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+ with pip
- CUDA-compatible GPU (recommended for better performance)

### Backend Setup

1. Create and activate a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required Node.js packages:
   ```
   npm install
   ```

## Running the Application

You can run both the frontend and backend with a single command using the provided script:

```
./run.sh
```

Or start them separately:

### Backend
```
python app.py
```

### Frontend
```
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Usage

1. Navigate to the "Upload" page
2. Upload an image containing text
3. Optionally select a specialized prompt for your document type
4. Click "Extract Text" to process the image
5. View the extracted text in a formatted display

## Technologies Used

- **Frontend**: React, TypeScript, Three.js, React Three Fiber, Framer Motion, Styled Components
- **Backend**: Flask, Transformers, PyTorch, PIL
- **ML Model**: Qwen2.5-VL (7B parameters)

## Advanced Usage

### Custom Prompts

You can customize the text extraction by providing specific prompts. For example:

- For receipts: "Extract all items with prices from this receipt"
- For business cards: "Extract name, title, company, phone, email and address"
- For documents: "Extract the key information and summarize this document"

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Qwen2.5-VL for the underlying vision-language model
- All open-source libraries and tools used in this project 