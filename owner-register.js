const ownerRegisterForm = document.getElementById('ownerRegisterForm');
const ownerNameInput = document.getElementById('ownerName');
const ownerEmailInput = document.getElementById('ownerEmail');
const ownerPasswordInput = document.getElementById('ownerPassword');
const ownerPhoneInput = document.getElementById('ownerPhone');
const ownerVehicleInput = document.getElementById('ownerVehicle');
const nameFeedback = document.getElementById('nameFeedback');
const emailFeedback = document.getElementById('emailFeedback');
const passwordFeedback = document.getElementById('passwordFeedback');
const phoneFeedback = document.getElementById('phoneFeedback');
const vehicleFeedback = document.getElementById('vehicleFeedback');
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

if (ownerRegisterForm) {
    ownerRegisterForm.addEventListener('submit', function (event) {
        event.preventDefault();

        clearInvalid(ownerNameInput, nameFeedback);
        clearInvalid(ownerEmailInput, emailFeedback);
        clearInvalid(ownerPasswordInput, passwordFeedback);
        clearInvalid(ownerPhoneInput, phoneFeedback);
        clearInvalid(ownerVehicleInput, vehicleFeedback);

        let isValid = true;

        if (!ownerNameInput.value.trim()) {
            setInvalid(ownerNameInput, nameFeedback, 'Please enter your name.');
            isValid = false;
        }

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

        if (!ownerPhoneInput.value.trim()) {
            setInvalid(ownerPhoneInput, phoneFeedback, 'Please enter your phone number.');
            isValid = false;
        } else if (!validatePhone(ownerPhoneInput.value.trim())) {
            setInvalid(ownerPhoneInput, phoneFeedback, 'Please enter a valid phone number (10-15 digits).');
            isValid = false;
        }

        if (!ownerVehicleInput.value.trim()) {
            setInvalid(ownerVehicleInput, vehicleFeedback, 'Please enter your vehicle number.');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Check if user already exists
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userExists = registeredUsers.find(user => user.email === ownerEmailInput.value.trim());

        if (userExists) {
            setInvalid(ownerEmailInput, emailFeedback, 'An account with this email already exists.');
            return;
        }

        const ownerData = {
            name: ownerNameInput.value.trim(),
            email: ownerEmailInput.value.trim(),
            password: ownerPasswordInput.value,
            phone: ownerPhoneInput.value.trim(),
            vehicle: ownerVehicleInput.value.trim(),
            registeredAt: new Date().toISOString(),
        };

        // Add to registered users
        registeredUsers.push(ownerData);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        // Also set as current login data
        localStorage.setItem('ownerRegisterData', JSON.stringify(ownerData));

        alert('Registration successful! Welcome, ' + ownerData.name + '.');
        ownerRegisterForm.reset();
        window.location.href = redirectUrl;
    });
}
