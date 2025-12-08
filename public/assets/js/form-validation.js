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
    
    // Track containers that have errors
    const containersWithErrors = new Set();
    
    // Clear existing error states from all containers
    const allContainers = form.querySelectorAll('.gfield');
    allContainers.forEach(container => {
        container.classList.remove('field-error');
        const oldError = container.querySelector('.field-error-message');
        if (oldError) oldError.remove();
    });
    
    // First pass: Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (isHoneypot(field)) return;
        
        const container = field.closest('.gfield');
        if (!container) return;
        
        const value = field.value.trim();
        
        // Check for errors
        if (!value) {
            containersWithErrors.add(container);
        } else if (field.type === 'email' && value && !emailRegex.test(value)) {
            containersWithErrors.add(container);
        } else if (field.type === 'tel' && value && !phoneRegex.test(value)) {
            containersWithErrors.add(container);
        }
    });
    
    // Second pass: Validate email matching for grouped email fields
    const emailGroups = form.querySelectorAll('.ginput_container_email');
    emailGroups.forEach(group => {
        const emailInputs = group.querySelectorAll('input[type="email"]');
        if (emailInputs.length >= 2) {
            const email1 = emailInputs[0].value.trim();
            const email2 = emailInputs[1].value.trim();
            
            // If both have values but don't match, mark container as error
            if (email1 && email2 && email1 !== email2) {
                const container = group.closest('.gfield');
                if (container) {
                    containersWithErrors.add(container);
                }
            }
        }
    });
    
    // Apply error states and scroll to first error if any
    if (containersWithErrors.size > 0) {
        // Convert to array to get first error container
        const errorArray = Array.from(containersWithErrors);
        
        // Apply error states
        errorArray.forEach(container => {
            container.classList.add('field-error');
            
            // Add error message if not already present
            if (!container.querySelector('.field-error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error-message';
                errorDiv.textContent = 'Please correct this field';
                container.appendChild(errorDiv);
            }
        });
        
        // Scroll to first error
        errorArray[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
    }
    
    return true;
};
