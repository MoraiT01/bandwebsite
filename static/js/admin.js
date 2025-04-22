// Admin JavaScript for Smokin' Breadsticks website

document.addEventListener('DOMContentLoaded', function() {
    // User dropdown menu
    const userBtn = document.querySelector('.admin-user-btn');
    const userDropdown = document.querySelector('.admin-user-dropdown');
    
    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', function() {
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!userBtn.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
    
    // Image upload preview
    const imageUploadInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    
    if (imageUploadInput && imagePreview) {
        imageUploadInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    imagePreview.style.display = 'block';
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Drag and drop file upload
    const uploadArea = document.querySelector('.image-upload-area');
    
    if (uploadArea && imageUploadInput) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadArea.classList.add('highlight');
        }
        
        function unhighlight() {
            uploadArea.classList.remove('highlight');
        }
        
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length) {
                imageUploadInput.files = files;
                
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                imageUploadInput.dispatchEvent(event);
            }
        }
        
        // Click to upload
        uploadArea.addEventListener('click', function() {
            imageUploadInput.click();
        });
    }
    
    // Image replacement confirmation
    const replaceButtons = document.querySelectorAll('.replace-image-btn');
    
    if (replaceButtons.length > 0) {
        replaceButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to replace this image? This action cannot be undone.')) {
                    e.preventDefault();
                }
            });
        });
    }
    
    // Delete image confirmation
    const deleteButtons = document.querySelectorAll('.delete-image-btn');
    
    if (deleteButtons.length > 0) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
                    e.preventDefault();
                }
            });
        });
    }
});
