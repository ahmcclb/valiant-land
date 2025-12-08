// GLOBAL FUNCTION for Netlify compatibility
window.validateValiantForm = function(form) {
    console.log('🎯 VALIDATE VALIANT FORM FIRED - Form:', form.name);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    
    function isHoneypot(field) {
        const isHidden = field.offsetParent === null || 
               field.type === 'hidden' || 
               field.style.display === 'none' ||
               field.getAttribute('tabindex') === '-1';
        const inHoneypot = field.closest('.honeypot-field, .gfield--type-honeypot') !== null;
        if (isHidden || inHoneypot) {
            console.log('  🍯 Honeypot detected, skipping:', field.name);
        }
        return isHidden || inHoneypot;
    }
    
    // Track containers that have errors
    const containersWithErrors = new Set();
    console.log('  📋 Starting validation...');
    
    // Clear existing error states from all containers
    const allContainers = form.querySelectorAll('.gfield');
    console.log('  🧹 Found', allContainers.length, 'field containers');
    allContainers.forEach((container, index) => {
        console.log('    Container', index, ':', container.className);
        container.classList.remove('field-error');
        const oldError = container.querySelector('.field-error-message');
        if (oldError) {
            console.log('      Removing old error message');
            oldError.remove();
        }
    });
    
    // First pass: Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    console.log('  ✅ Found', requiredFields.length, 'required fields');
    
    requiredFields.forEach((field, index) => {
        console.log('    Field', index, ':', field.name, 'type:', field.type, 'value:', `"${field.value}"`);
        
        if (isHoneypot(field)) return;
        
        const container = field.closest('.gfield');
        if (!container) {
            console.log('      ❌ No container found!');
            return;
        }
        
        const value = field.value.trim();
        let isValid = true;
        let errorType = '';
        
        if (!value) {
            console.log('      ❌ Empty required field');
            isValid = false;
            errorType = 'required';
        } else if (field.type === 'email' && value && !emailRegex.test(value)) {
            console.log('      ❌ Invalid email format');
            isValid = false;
            errorType = 'email';
        } else if (field.type === 'tel' && value && !phoneRegex.test(value)) {
            console.log('      ❌ Invalid phone format');
            isValid = false;
            errorType = 'phone';
        } else {
            console.log('      ✓ Valid field');
        }
        
        if (!isValid) {
            console.log('      Marking container as error:', container.className);
            containersWithErrors.add(container);
        }
    });
    
    // Second pass: Validate email matching for grouped email fields
    const emailGroups = form.querySelectorAll('.ginput_container_email');
    console.log('  📧 Found', emailGroups.length, 'email groups');
    
    emailGroups.forEach((group, index) => {
        const emailInputs = group.querySelectorAll('input[type="email"]');
        console.log('    Group', index, ':', emailInputs.length, 'email inputs');
        
        if (emailInputs.length >= 2) {
            const email1 = emailInputs[0].value.trim();
            const email2 = emailInputs[1].value.trim();
            console.log('      Email 1:', `"${email1}"`, 'Email 2:', `"${email2}"`);
            
            if (email1 && email2 && email1 !== email2) {
                console.log('      ❌ Emails do not match!');
                const container = group.closest('.gfield');
                if (container) {
                    console.log('      Marking container as error for mismatch');
                    containersWithErrors.add(container);
                }
            } else if (email1 === email2 && email1 !== '') {
                console.log('      ✓ Emails match');
            }
        }
    });
    
    console.log('  📊 Total containers with errors:', containersWithErrors.size);
    
    // Apply error states and scroll to first error if any
    if (containersWithErrors.size > 0) {
        const errorArray = Array.from(containersWithErrors);
        console.log('  🚨 Applying error states to', errorArray.length, 'containers');
        
        errorArray.forEach((container, index) => {
            console.log('    Adding .field-error to container', index, ':', container.className);
            container.classList.add('field-error');
            
            // Add error message if not already present
            if (!container.querySelector('.field-error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error-message';
                errorDiv.textContent = 'Please correct this field';
                container.appendChild(errorDiv);
                console.log('      Added error message div');
            }
        });
        
        // Scroll to first error
        console.log('  📜 Scrolling to first error');
        errorArray[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        console.log('  ❌ VALIDATION FAILED - Preventing submission');
        return false;
    }
    
    console.log('  ✅ VALIDATION PASSED - Allowing submission');
    return true;
};
