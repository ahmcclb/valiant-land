// form-validation.js - Phase 6 Client-Side Validation
document.addEventListener('DOMContentLoaded', function() {
    // Target all Netlify forms
    const forms = document.querySelectorAll('form[data-netlify="true"]');
    
    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    const apnRegex = /^[a-zA-Z0-9\s\-\#\.\/]{5,}$/; // Min 5 chars, alphanumeric + common symbols
    
    forms.forEach(form => {
        // Add blur listeners for real-time validation
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
        fields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
        });
        
        // Intercept form submission
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
                return false;
            }
        });
    });
    
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Scroll to first error if validation fails
        if (!isValid) {
            const firstError = form.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const fieldContainer = field.closest('.gfield, .form-field-group');
        if (!fieldContainer) return true;
        
        // Reset error state
        fieldContainer.classList.remove('field-error');
        
        // Get existing error message element or create one
        let errorMessage = fieldContainer.querySelector('.field-error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'field-error-message';
            fieldContainer.appendChild(errorMessage);
        }
        
        const value = field.value.trim();
        let errorText = '';
        
        // Required validation
        if (!value) {
            errorText = 'This field is required';
        }
        // Email validation
        else if (field.type === 'email' && !emailRegex.test(value)) {
            errorText = 'Please enter a valid email address';
        }
        // Phone validation and normalization
        else if (field.type === 'tel' && value) {
            if (!phoneRegex.test(value)) {
                errorText = 'Please enter a valid phone number';
            } else {
                // Normalize to XXX-XXX-XXXX format
                const normalized = value.replace(phoneRegex, '$1-$2-$3');
                field.value = normalized;
            }
        }
        // APN/Property validation (fields with 'apn' or 'address' in name)
        else if ((field.name.toLowerCase().includes('apn') || field.name.toLowerCase().includes('address')) && !apnRegex.test(value)) {
            errorText = 'Please provide a valid property identifier (min 5 characters)';
        }
        
        // Show error if exists
        if (errorText) {
            fieldContainer.classList.add('field-error');
            errorMessage.textContent = errorText;
            return false;
        }
        
        return true;
    }
});
