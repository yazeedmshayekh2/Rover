import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromImage, clearCache } from '../services/api';

const UploadContainer = styled.div`
  max-width: 1000px;
  margin: 3rem auto;
  padding: 0 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--dark-color);
  text-align: center;
`;

const PageDescription = styled.p`
  text-align: center;
  margin-bottom: 3rem;
  color: var(--secondary-color);
  font-size: 1.1rem;
`;

const UploadCard = styled(motion.div)`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const UploadCardHeader = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem;
  
  h2 {
    font-size: 1.5rem;
    margin: 0;
    display: flex;
    align-items: center;
    
    i {
      margin-right: 0.8rem;
    }
  }
`;

const UploadCardBody = styled.div`
  padding: 2rem;
`;

const Dropzone = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${props => props.isDragActive ? 'var(--primary-color)' : '#ddd'};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.isDragActive ? 'rgba(0, 123, 255, 0.05)' : 'transparent'};
  
  &:hover {
    border-color: var(--primary-color);
    background-color: rgba(0, 123, 255, 0.05);
  }
`;

const DropzoneIcon = styled.div`
  font-size: 3rem;
  color: #aaa;
  margin-bottom: 1rem;
`;

const DropzoneText = styled.p`
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
`;

const DropzoneHint = styled.p`
  color: #aaa;
  font-size: 0.9rem;
`;

const ImagePreview = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const RemoveButton = styled.button`
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  color: var(--secondary-color);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #e2e6ea;
  }
`;

const PromptInput = styled.div`
  margin-top: 2rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--dark-color);
  }
  
  textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    resize: vertical;
    min-height: 80px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
  }
  
  .hint {
    color: #aaa;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  margin-top: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background-color: #0069d9;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultsCard = styled(motion.div)`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 3rem;
`;

const ResultsCardHeader = styled.div`
  background-color: var(--success-color);
  color: white;
  padding: 1.5rem;
  
  h2 {
    font-size: 1.5rem;
    margin: 0;
    display: flex;
    align-items: center;
    
    i {
      margin-right: 0.8rem;
    }
  }
`;

const ResultsCardBody = styled.div`
  padding: 2rem;
`;

const ResultText = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 1.5rem;
  white-space: pre-wrap;
  
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--dark-color);
  }
  
  /* Styling for extracted text content */
  .card-document {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }
  
  .card-header-blue {
    background-color: var(--primary-color);
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-body-light {
    background-color: white;
    padding: 1.5rem;
  }
  
  .inner-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    margin-top: 1rem;
  }
  
  .card-content {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
  }
  
  .number {
    font-weight: bold;
    color: var(--primary-color);
    margin-right: 0.5rem;
  }
  
  .key {
    font-weight: bold;
    color: var(--dark-color);
    margin-right: 0.5rem;
  }
  
  .value {
    color: var(--secondary-color);
  }
  
  .text {
    color: var(--dark-color);
  }
  
  .btn-icon-white {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .extracted-content {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
  }
  
  .section-title {
    color: var(--primary-color);
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  .list-item {
    margin-bottom: 0.8rem;
    display: flex;
  }
  
  .list-number, .list-bullet {
    margin-right: 0.5rem;
    color: var(--primary-color);
    font-weight: bold;
  }
  
  .key-value {
    margin-bottom: 0.8rem;
    display: flex;
    flex-wrap: wrap;
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 123, 255, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: var(--dark-color);
  font-size: 1.2rem;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: var(--error-color);
  padding: 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  border-left: 4px solid var(--error-color);
  
  p {
    margin: 0;
    display: flex;
    align-items: center;
    
    i {
      margin-right: 0.5rem;
    }
  }
`;

const CopyButton = styled.button`
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  color: var(--secondary-color);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  i {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: #e2e6ea;
  }
`;

const ClearCacheButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  margin-left: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  i {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: #5a6268;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuickPromptBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const QuickPromptTitle = styled.h4`
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--dark-color);
`;

const QuickPromptGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.8rem;
`;

const QuickPromptButton = styled.button<{ active: boolean }>`
  padding: 0.6rem 1rem;
  background-color: ${props => props.active ? 'var(--primary-color)' : '#e9ecef'};
  color: ${props => props.active ? 'white' : 'var(--dark-color)'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  i {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : '#ced4da'};
  }
`;

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [clearingCache, setClearingCache] = useState<boolean>(false);
  const [activePrompt, setActivePrompt] = useState<string>('');
  const textRef = useRef<HTMLDivElement>(null);
  
  // Quick prompts
  const quickPrompts = {
    idCard: "Extract all information from this ID card including document title, ID number, full name, date of birth, place of birth, gender, nationality, and any other fields present. For non-English text, include translations if possible.",
    receipt: "Extract all details from this receipt including store name, date, all items with prices, subtotal, tax, and total amount.",
    businessCard: "Extract all information from this business card including name, title, company, address, phone number, email, and website.",
    table: "Extract this table data preserving its structure and alignment. Include all headers and values.",
    form: "Extract all fields and their values from this form document. Preserve the form structure."
  };
  
  const handleQuickPromptClick = (promptKey: keyof typeof quickPrompts) => {
    setPrompt(quickPrompts[promptKey]);
    setActivePrompt(promptKey);
  };
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Clear previous results and errors
      setExtractedText('');
      setError('');
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1
  });
  
  const removeImage = () => {
    setFile(null);
    setFilePreview('');
    setExtractedText('');
    setError('');
  };
  
  const handleSubmit = async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await extractTextFromImage(file, prompt);
      
      if (response.success && response.result) {
        setExtractedText(response.result);
      } else {
        setError(response.message || 'No text could be extracted from the image. Please try another image or adjust your prompt.');
      }
    } catch (error) {
      setError('An error occurred while processing the image. Please try again later.');
      console.error('Error processing image:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (textRef.current) {
      // Create a hidden text area to put the plain text content
      const textArea = document.createElement('textarea');
      
      // Extract text content from HTML
      const htmlContent = textRef.current.querySelector('div[dangerouslySetInnerHTML]');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = extractedText;
      textArea.value = tempDiv.textContent || tempDiv.innerText || '';
      
      // Make it invisible
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      // Select and copy
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      
      // Clean up
      document.body.removeChild(textArea);
      alert('Text copied to clipboard!');
    }
  };
  
  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      const response = await clearCache();
      if (response.success) {
        alert('GPU memory cleared successfully');
      } else {
        alert(`Failed to clear memory: ${response.message}`);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('An error occurred while clearing the cache');
    } finally {
      setClearingCache(false);
    }
  };
  
  return (
    <UploadContainer>
      <PageTitle>Upload an Image</PageTitle>
      <PageDescription>
        Upload any image containing text and our AI will extract the content for you.
      </PageDescription>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <ClearCacheButton 
          onClick={handleClearCache} 
          disabled={clearingCache}
        >
          {clearingCache ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Clearing...
            </>
          ) : (
            <>
              <i className="fas fa-broom"></i> Clear GPU Memory
            </>
          )}
        </ClearCacheButton>
      </div>
      
      <UploadCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UploadCardHeader>
          <h2><i className="fas fa-upload"></i> Upload Image</h2>
        </UploadCardHeader>
        
        <UploadCardBody>
          <Dropzone {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />
            <DropzoneIcon>
              <i className="fas fa-cloud-upload-alt"></i>
            </DropzoneIcon>
            <DropzoneText>{isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}</DropzoneText>
            <DropzoneHint>Supported formats: JPG, PNG, GIF, BMP, WEBP</DropzoneHint>
          </Dropzone>
          
          {filePreview && (
            <ImagePreview>
              <PreviewImage src={filePreview} alt="Preview" />
              <RemoveButton onClick={removeImage}>
                <i className="fas fa-trash-alt"></i> Remove Image
              </RemoveButton>
            </ImagePreview>
          )}
          
          <QuickPromptBox>
            <QuickPromptTitle>Quick Prompts:</QuickPromptTitle>
            <QuickPromptGrid>
              <QuickPromptButton 
                active={activePrompt === 'idCard'} 
                onClick={() => handleQuickPromptClick('idCard')}
              >
                <i className="fas fa-id-card"></i> ID Card
              </QuickPromptButton>
              <QuickPromptButton 
                active={activePrompt === 'receipt'} 
                onClick={() => handleQuickPromptClick('receipt')}
              >
                <i className="fas fa-receipt"></i> Receipt
              </QuickPromptButton>
              <QuickPromptButton 
                active={activePrompt === 'businessCard'} 
                onClick={() => handleQuickPromptClick('businessCard')}
              >
                <i className="fas fa-address-card"></i> Business Card
              </QuickPromptButton>
              <QuickPromptButton 
                active={activePrompt === 'table'} 
                onClick={() => handleQuickPromptClick('table')}
              >
                <i className="fas fa-table"></i> Table
              </QuickPromptButton>
              <QuickPromptButton 
                active={activePrompt === 'form'} 
                onClick={() => handleQuickPromptClick('form')}
              >
                <i className="fas fa-file-alt"></i> Form
              </QuickPromptButton>
            </QuickPromptGrid>
          </QuickPromptBox>
          
          <PromptInput>
            <label htmlFor="prompt">Custom Prompt (Optional):</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (e.target.value !== quickPrompts.idCard && 
                    e.target.value !== quickPrompts.receipt && 
                    e.target.value !== quickPrompts.businessCard && 
                    e.target.value !== quickPrompts.table && 
                    e.target.value !== quickPrompts.form) {
                  setActivePrompt('');
                }
              }}
              placeholder="For example: 'Extract all items with prices from this receipt' or 'Extract name, title, company, phone, email from this business card'"
            />
            <p className="hint">Leave empty for automatic prompt detection or select a quick prompt above</p>
          </PromptInput>
          
          <SubmitButton 
            onClick={handleSubmit} 
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Processing...
              </>
            ) : (
              <>
                <i className="fas fa-magic"></i> Extract Text
              </>
            )}
          </SubmitButton>
          
          {error && (
            <ErrorMessage>
              <p><i className="fas fa-exclamation-circle"></i> {error}</p>
            </ErrorMessage>
          )}
        </UploadCardBody>
      </UploadCard>
      
      <AnimatePresence>
        {extractedText && (
          <ResultsCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsCardHeader>
              <h2><i className="fas fa-file-alt"></i> Extracted Text</h2>
            </ResultsCardHeader>
            
            <ResultsCardBody>
              <ResultText ref={textRef}>
                <h3>Results:</h3>
                <div dangerouslySetInnerHTML={{ __html: extractedText }} />
              </ResultText>
              
              <CopyButton onClick={copyToClipboard}>
                <i className="fas fa-copy"></i> Copy to Clipboard
              </CopyButton>
            </ResultsCardBody>
          </ResultsCard>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {loading && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Spinner />
            <LoadingText>Processing your image...</LoadingText>
          </LoadingOverlay>
        )}
      </AnimatePresence>
    </UploadContainer>
  );
};

export default Upload; 