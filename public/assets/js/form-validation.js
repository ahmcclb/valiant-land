// form-validation.js - DEBUGGED VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Valiant Land Form Validation Loading...');
    
    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    const apnRegex = /^[a-zA-Z0-9\s\-\#\.\/]{5,}$/;
    
    // Honeypot detection function
    function isHoneypot(field) {
        return (
            field.offsetParent === null || // Hidden by CSS
            field.type === 'hidden' || // Hidden input type
            field.style.display === 'none' || // Inline hidden
            field.hasAttribute('tabindex') && field.getAttribute('tabindex') === '-1' || // Tabindex -1
            field.closest('.honeypot-field') !== null || // Inside honeypot container
            field.closest('.gfield--type-honeypot') !== null || // Gravity Forms honeypot
            field.name === 'bot-field' || // Common honeypot name
            field.name === 'ak_hp_textarea' || // Akismet honeypot
            field.name.includes('_57') // Your specific honeypot field
        );
    }
    
    // Find the error message container (create if needed)
    function getErrorContainer(field) {
        // Gravity Forms structure: .gfield is the parent container
        let container = field.closest('.gfield, .form-field-group');
        if (!container) return null;
        
        // Look for existing error message or create one
        let errorDiv = container.querySelector('.field-error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error-message';
            container.appendChild(errorDiv);
        }
        
        return errorDiv;
    }
    
    // Validate individual field
    function validateField(field) {
        // Skip honeypot fields entirely
        if (isHoneypot(field)) {
            console.log('🍯 Skipping honeypot field:', field.name);
            return true;
        }
        
        const errorDiv = getErrorContainer(field);
        if (!errorDiv) return true;
        
        // Reset error state
        field.closest('.gfield, .form-field-group').classList.remove('field-error');
        errorDiv.textContent = '';
        
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
                // Normalize to XXX-XXX-XXXX
                const normalized = value.replace(phoneRegex, '$1-$2-$3');
                field.value = normalized;
            }
        }
        // APN/Address validation
        else if ((field.name.includes('7.1') || field.name.includes('input_30')) && !apnRegex.test(value)) {
            errorText = 'Please provide a valid property identifier (min 5 characters)';
        }
        
        // Show error if exists
        if (errorText) {
            field.closest('.gfield, .form-field-group').classList.add('field-error');
            errorDiv.textContent = errorText;
            console.log('❌ Validation failed:', field.name, errorText);
            return false;
        }
        
        console.log('✅ Validation passed:', field.name);
        return true;
    }
    
    // Validate entire form
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        console.log('🧪 Validating form with', requiredFields.length, 'required fields');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            console.log('🚨 Form validation FAILED');
            const firstError = form.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        } else {
            console.log('✅ Form validation PASSED - submitting to Netlify');
        }
        
        return isValid;
    }
    
    // Attach to all Netlify forms
    const forms = document.querySelectorAll('form[data-netlify="true"]');
    console.log('📋 Found', forms.length, 'Netlify forms to validate');
    
    forms.forEach(form => {
        // Add blur listeners
        form.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
        });
        
        // Intercept submission
        form.addEventListener('submit', function(e) {
            console.log('🎯 Form submission intercepted');
            if (!validateForm(form)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
    });
});