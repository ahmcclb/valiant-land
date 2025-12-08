// GLOBAL FUNCTION for Netlify compatibility
window.validateValiantForm = function(form) {
    console.log('🎯 VALIDATE VALIANT FORM FIRED');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    
    function isHoneypot(field) {
        return field.offsetParent === null || 
               field.type === 'hidden' || 
               field.style.display === 'none' ||
               field.getAttribute('tabindex') === '-1' ||
               field.closest('.honeypot-field, .gfield--type-honeypot') !== null;
    }
    
    function validateField(field) {
        if (isHoneypot(field)) return true;
        
        const container = field.closest('.gfield');
        if (!container) return true;
        
        container.classList.remove('field-error');
        const oldError = container.querySelector('.field-error-message');
        if (oldError) oldError.remove();
        
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
            return false;
        }
        return true;
    }
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    
    if (!isValid) {
        const firstError = form.querySelector('.field-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
    }
    
    return true;
};