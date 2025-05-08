document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const uploadForm = document.getElementById('upload-form');
    const dropZone = document.querySelector('.drop-zone');
    const fileInput = document.querySelector('.drop-zone__input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const resultCard = document.getElementById('result-card');
    const resultContainer = document.getElementById('result-container');
    const copyBtn = document.getElementById('copy-btn');
    const loadingIndicator = document.getElementById('loading');
    const extractBtn = document.getElementById('extract-btn');
    const clearCacheBtn = document.getElementById('clear-cache-btn');
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Handle drag and drop functionality
    ['dragover', 'dragenter'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('active');
        });
    });
    
    ['dragleave', 'dragend'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('active');
        });
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateThumbnail(dropZone, e.dataTransfer.files[0]);
        }
    });
    
    // Update thumbnail when file is selected
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            updateThumbnail(dropZone, fileInput.files[0]);
        }
    });
    
    // Handle click on drop zone
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle clear cache button
    clearCacheBtn.addEventListener('click', async () => {
        clearCacheBtn.disabled = true;
        clearCacheBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing...';
        
        try {
            const response = await fetch('/clear_cache', {
                method: 'POST'
            });
            
            if (response.ok) {
                showNotification('GPU memory cleared successfully', 'success');
            } else {
                showNotification('Failed to clear memory', 'error');
            }
        } catch (error) {
            showNotification('Error clearing memory: ' + error.message, 'error');
        } finally {
            clearCacheBtn.disabled = false;
            clearCacheBtn.innerHTML = '<i class="fas fa-broom"></i> Clear Memory';
        }
    });
    
    // Handle form submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(uploadForm);
        
        if (!fileInput.files.length) {
            showNotification('Please select an image first', 'error');
            return;
        }
        
        // Show loading state
        loadingIndicator.classList.remove('hidden');
        resultContainer.innerHTML = '';
        resultCard.classList.remove('hidden');
        extractBtn.disabled = true;
        extractBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        try {
            const response = await fetch('/extract', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                resultContainer.innerHTML = data.result;
                
                // Add event listener for JSON download button
                setupDownloadButton();
                
                showNotification('Text extracted successfully', 'success');
            } else {
                resultContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> Error: ${data.error}</div>`;
                
                // Show special notification for Out of Memory errors
                if (data.error && data.error.includes('CUDA out of memory')) {
                    showNotification('GPU Out of Memory error. Try clicking "Clear Memory" button and try again with a smaller image.', 'error', 6000);
                } else {
                    showNotification('Failed to extract text', 'error');
                }
            }
        } catch (error) {
            resultContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> Error: ${error.message}</div>`;
            showNotification('An error occurred', 'error');
        } finally {
            loadingIndicator.classList.add('hidden');
            extractBtn.disabled = false;
            extractBtn.innerHTML = '<i class="fas fa-magic"></i> Extract Text';
        }
    });
    
    // Setup JSON download button functionality
    function setupDownloadButton() {
        const downloadBtn = document.getElementById('download-json');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch('/download_json');
                    if (response.ok) {
                        const data = await response.json();
                        
                        // Display the prompt that was used
                        if (data.prompt_used) {
                            showNotification(`Using prompt: ${data.prompt_used.substring(0, 50)}...`, 'info', 5000);
                        }
                        
                        // Create blob and download
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'extracted_text.json';
                        document.body.appendChild(a);
                        a.click();
                        
                        // Cleanup
                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }, 0);
                        
                        showNotification('JSON file downloaded', 'success');
                    } else {
                        showNotification('Failed to download JSON', 'error');
                    }
                } catch (error) {
                    showNotification('Error downloading JSON: ' + error.message, 'error');
                }
            });
        }
    }
    
    // Handle copy button
    copyBtn.addEventListener('click', () => {
        const textToCopy = resultContainer.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Copied to clipboard', 'success');
        }).catch(err => {
            showNotification('Failed to copy text', 'error');
        });
    });
    
    // Function to update thumbnail
    function updateThumbnail(dropZone, file) {
        // Show preview container
        previewContainer.classList.remove('hidden');
        
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            previewContainer.classList.add('hidden');
            showNotification('Please select an image file', 'error');
            return;
        }
        
        // Read the file and display thumbnail
        const reader = new FileReader();
        
        reader.onload = () => {
            imagePreview.src = reader.result;
        };
        
        reader.readAsDataURL(file);
    }
    
    // Function to show notification
    function showNotification(message, type, duration = 3000) {
        // Check if notification container exists
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Auto remove after specified duration
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
    
    // Add notification styles dynamically
    const notificationStyles = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .notification {
            background-color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            padding: 12px 20px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            min-width: 250px;
            transform: translateX(0);
            transition: all 0.3s ease;
        }
        
        .notification.hide {
            transform: translateX(120%);
            opacity: 0;
        }
        
        .notification i {
            margin-right: 10px;
            font-size: 1.2rem;
        }
        
        .notification.success i {
            color: var(--success-color);
        }
        
        .notification.error i {
            color: var(--error-color);
        }
        
        .notification.info i {
            color: var(--primary-color);
        }
        
        .error-message {
            color: var(--error-color);
            padding: 10px;
            border-radius: 4px;
            background-color: rgba(244, 67, 54, 0.1);
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = notificationStyles;
    document.head.appendChild(styleElement);
}); 