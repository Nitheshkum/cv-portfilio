document.addEventListener('DOMContentLoaded', function() {
    var contactForm = document.getElementById('contact-form');
    var loader = document.getElementById('loader');
    var errorMessage = document.getElementById('error');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Clear previous messages
        clearMessages();

        // Perform validation
        var isValid = validateForm();

        if (isValid) {
            loader.style.display = 'block';
            
            var formData = new FormData(contactForm);
            
            fetch('contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(response => {
                loader.style.display = 'none';
                if (response.trim() === 'success') {
                    window.location.href = 'thank-you.html'; // Redirect to thank-you page
                    contactForm.reset();
                } else {
                    errorMessage.style.display = 'block';
                    alert('There was an error sending your message. Please try again later.');
                }
            })
            .catch(() => {
                loader.style.display = 'none';
                errorMessage.style.display = 'block';
                alert('There was an error sending your message. Please try again later.');
            });
        } else {
            alert('Please fill in all required fields correctly.');
        }
    });

    function validateForm() {
        var isValid = true;
        var requiredFields = document.querySelectorAll('.requiredField');

        requiredFields.forEach(function(field) {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            } else if (field.type === 'email' && !validateEmail(field.value.trim())) {
                isValid = false;
                showError(field, 'Please enter a valid email address');
            }
        });

        return isValid;
    }

    function showError(field, message) {
        var errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
        field.classList.add('error-input');
    }

    function clearErrors() {
        var errors = document.querySelectorAll('.error');
        errors.forEach(function(error) {
            error.parentNode.removeChild(error);
        });

        var errorInputs = document.querySelectorAll('.error-input');
        errorInputs.forEach(function(input) {
            input.classList.remove('error-input');
        });
    }

    function clearMessages() {
        errorMessage.style.display = 'none';
    }

    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
