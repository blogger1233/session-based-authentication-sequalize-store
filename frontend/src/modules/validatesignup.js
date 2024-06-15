export default  function validate(state) {
    const { email, confirm_password, password, age, name } = state;
    const inputs_notvalid = [];

    // Check if confirm_password matches password
    if (confirm_password !== password) {
        inputs_notvalid.push("confirm_password");
    }

    // Validate email format
    if (!isValidEmail(email)) {
        inputs_notvalid.push("email");
    }

    // Validate password length or complexity (example checks)
    if (password.length < 8 || /\s/.test(password)) {
        // Check if password length is less than 8 OR if it contains whitespace
        inputs_notvalid.push("password");
    }

    const datePattern= /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(age)) {
        inputs_notvalid.push("age");
    }

    // Validate name (example: must not be empty)
    if (name.trim() === "") {
        inputs_notvalid.push("name");
    }

    return inputs_notvalid;
}

// Function to validate email format (example implementation)
function isValidEmail(email) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
