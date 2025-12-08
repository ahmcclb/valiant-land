// DEBUGGED FORM VALIDATION - Valiant Land
console.log('🔥 FORM VALIDATION SCRIPT INITIALIZING');

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOMContentLoaded fired - searching for forms');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    
    // Aggressive honeypot detection
    function isHoneypot(field) {
        return field.offsetParent === null || 
               field.type === 'hidden' || 
               field.style.display === 'none' ||
               field.getAttribute('tabindex') === '-1' ||
               field.closest('.honeypot-field, .gfield--type-honeypot') !== null;
    }
    
    // Field validation
    function validateField(field) {
        if (isHoneypot(field)) return true;
        
        const container = field.closest('.gfield');
        if (!container) {
            console.warn('⚠️ Could not find .gfield container for:', field.name);
            return true;
        }
        
        // Clear previous errors
        container.classList.remove('field-error');
        const existingError = container.querySelector('.field-error-message');
        if (existingError) existingError.remove();
        
        const value = field.value.trim();
        let errorText = '';
        
        if (!value && field.hasAttribute('required')) {
            errorText = 'This field is required';
        } else if (field.type === 'email' && value && !emailRegex.test(value)) {
            errorText = 'Please enter a valid email address';
        } else if (field.type === 'tel' && value && !phoneRegex.test(value)) {
            errorText = 'Please enter a valid phone number';
        }
        
        if (errorText) {
            container.classList.add('field-error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error-message';
            errorDiv.textContent = errorText;
            container.appendChild(errorDiv);
            console.log('❌ Error on', field.name, ':', errorText);
            return false;
        }
        
        console.log('✅ Valid:', field.name);
        return true;
    }
    
    // Form validation
    function validateForm(form) {
        console.log('🧪 Starting form validation for:', form.name);
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        console.log('Found', requiredFields.length, 'required fields');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            console.log('🚨 VALIDATION FAILED');
            const firstError = form.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            console.log('✅ VALIDATION PASSED - ALLOWING SUBMIT');
        }
        
        return isValid;
    }
    
    // Find and attach to forms
    const forms = document.querySelectorAll('form[data-netlify="true"]');
    console.log('🎯 Found', forms.length, 'Netlify forms');
    
    if (forms.length === 0) {
        console.error('❌ NO NETLIFY FORMS FOUND - SCRIPT WILL NOT WORK');
    }
    
    forms.forEach(form => {
        console.log('🔌 Attaching validation to form:', form.name);
        
        // Attach blur listeners
        form.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('blur', () => {
                console.log('👁️ Blur event on:', field.name);
                validateField(field);
            });
        });
        
        // CRITICAL: Use addEventListener with capture phase
        form.addEventListener('submit', function(e) {
            console.log('🎯 SUBMIT EVENT CAPTURED - EXECUTING VALIDATION');
            
            if (!validateForm(form)) {
                console.log('⛔ PREVENTING SUBMISSION - ERRORS FOUND');
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }
            
            console.log('✅ NO ERRORS - ALLOWING NETLIFY SUBMISSION');
        }, false); // Use bubbling phase, not capture
    });
});