const ownerLoginForm = document.getElementById('ownerLoginForm');
const ownerNameInput = document.getElementById('ownerName');
const ownerEmailInput = document.getElementById('ownerEmail');
const ownerPasswordInput = document.getElementById('ownerPassword');
const ownerPhoneInput = document.getElementById('ownerPhone');
const nameFeedback = document.getElementById('nameFeedback');
const emailFeedback = document.getElementById('emailFeedback');
const passwordFeedback = document.getElementById('passwordFeedback');
const phoneFeedback = document.getElementById('phoneFeedback');
const togglePassword = document.getElementById('togglePassword');
const redirectUrl = 'owner-dashboard.html';

function setInvalid(input, feedback, message) {
    input.classList.add('is-invalid');
    feedback.textContent = message;
}

function clearInvalid(input, feedback) {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
}

function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePhone(value) {
    return /^[0-9]{10,15}$/.test(value);
}

if (togglePassword) {
    togglePassword.addEventListener('click', function () {
        const passwordField = ownerPasswordInput;
        const currentType = passwordField.type === 'password' ? 'text' : 'password';
        passwordField.type = currentType;
        const icon = this.querySelector('i');
        icon.classList.toggle('bi-eye');
        icon.classList.toggle('bi-eye-slash');
    });
}

if (ownerLoginForm) {
    ownerLoginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        clearInvalid(ownerNameInput, nameFeedback);
        clearInvalid(ownerEmailInput, emailFeedback);
        clearInvalid(ownerPasswordInput, passwordFeedback);
        clearInvalid(ownerPhoneInput, phoneFeedback);

        let isValid = true;

        if (!ownerEmailInput.value.trim()) {
            setInvalid(ownerEmailInput, emailFeedback, 'Please enter your email address.');
            isValid = false;
        } else if (!validateEmail(ownerEmailInput.value.trim())) {
            setInvalid(ownerEmailInput, emailFeedback, 'Please enter a valid email address.');
            isValid = false;
        }

        if (!ownerPasswordInput.value || ownerPasswordInput.value.length < 6) {
            setInvalid(ownerPasswordInput, passwordFeedback, 'Password must be at least 6 characters long.');
            isValid = false;
        }

        if (ownerPhoneInput.value.trim() && !validatePhone(ownerPhoneInput.value.trim())) {
            setInvalid(ownerPhoneInput, phoneFeedback, 'Please enter a valid phone number (10-15 digits).');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userExists = registeredUsers.find(user =>
            user.email === ownerEmailInput.value.trim() &&
            user.password === ownerPasswordInput.value
        );

        if (!userExists) {
            setInvalid(ownerEmailInput, emailFeedback, 'Invalid email or password. Please check your credentials or register first.');
            setInvalid(ownerPasswordInput, passwordFeedback, 'Invalid email or password. Please check your credentials or register first.');
            return;
        }

        const ownerData = {
            name: userExists.name || '',
            email: userExists.email,
            password: userExists.password,
            phone: userExists.phone || ownerPhoneInput.value.trim(),
            vehicle: userExists.vehicle || '',
            loggedInAt: new Date().toISOString(),
        };

        localStorage.setItem('ownerLoginData', JSON.stringify(ownerData));
        alert('Login successful! Welcome back' + (ownerData.name ? ', ' + ownerData.name : '') + '.');
        ownerLoginForm.reset();
        window.location.href = redirectUrl;
    });
}
