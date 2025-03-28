document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('auth-form');
    const toggleModeButton = document.getElementById('toggle-mode');
    const titleElement = document.getElementById('title');
    const subtitleElement = document.getElementById('subtitle');
    const submitButton = document.querySelector('.submit-button');
    const togglePasswordButton = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const socialButtons = document.querySelectorAll('.social-button');

    let isSignUp = false;

    // Toggle between login and signup mode
    toggleModeButton.addEventListener('click', function() {
        isSignUp = !isSignUp;

        if (isSignUp) {
            titleElement.textContent = 'Create Account';
            subtitleElement.textContent = 'Sign up to start your sneaker journey';
            submitButton.textContent = 'Sign Up';
            toggleModeButton.textContent = 'Sign In';
            form.action = '/register';
        } else {
            titleElement.textContent = 'Welcome Back';
            subtitleElement.textContent = 'Log in to access your sneaker collection';
            submitButton.textContent = 'Sign In';
            toggleModeButton.textContent = 'Sign Up';
            form.action = '/login';
        }

        // Add animation effect
        animateFormTransition();
    });

    // Validate password complexity
    form.addEventListener('submit', function(event) {
        const password = passwordInput.value;
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if (!passwordPattern.test(password)) {
            event.preventDefault(); // Prevent form submission
            alert("Password must be at least 6 characters long, include one uppercase letter, one number, and one special character.");
            passwordInput.focus();
        }
    });

    // Toggle password visibility
    togglePasswordButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Update the toggle icon based on password visibility
        const eyeIcon = togglePasswordButton.querySelector('svg');
        if (type === 'text') {
            togglePasswordButton.style.opacity = '1';
            eyeIcon.innerHTML = `
                <path d="M2 2L22 22" stroke="#9b87f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884" stroke="#9b87f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19.4666 15.4407C20.8319 14.1113 21.9999 12 21.9999 12C21.9999 12 18.3635 5 11.9999 5C11.1398 5 10.3172 5.14618 9.54492 5.41006" stroke="#9b87f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.99998 12.01C7.99548 10.8482 8.87998 9.9458 9.99998 9.93665" stroke="#9b87f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12.3046 12.2C12.4376 12.8046 12.9502 13.3262 13.6282 13.4713" stroke="#9b87f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            `;
        } else {
            togglePasswordButton.style.opacity = '0.6';
            eyeIcon.innerHTML = `
                <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42001 13.98 8.42001 12C8.42001 10.02 10.02 8.42001 12 8.42001C13.98 8.42001 15.58 10.02 15.58 12Z" stroke="#9b87f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.47 3.71997 5.18 5.79997 2.89 9.39997C1.99 10.81 1.99 13.18 2.89 14.59C5.18 18.19 8.47 20.27 12 20.27Z" stroke="#9b87f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            `;
        }
    });

    // Apply ripple effect to buttons
    const buttons = document.querySelectorAll('button, .submit-button');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    function createRipple(event) {
        if (this.className.includes('toggle-password') ||
            this.id === 'toggle-mode' ||
            this.className.includes('social-button')) {
            return; // Skip for certain buttons
        }

        const button = event.currentTarget;

        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];

        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    function animateFormTransition() {
        form.style.opacity = '0';
        form.style.transform = 'translateY(10px)';

        setTimeout(() => {
            form.style.transition = 'all 0.5s ease';
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 150);
    }

    // Add animation class after page load
    setTimeout(() => {
        document.querySelector('.login-card').classList.add('loaded');
    }, 100);
});
