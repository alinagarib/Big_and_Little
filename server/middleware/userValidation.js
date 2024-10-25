const validateUsername = (username) => {
    // Limit username to 100 characters
    if (username.length > 100) {
        return {
            valid: false,
            reason: "Username must be less than 100 characters!",
        };
    }
    return {
        valid: true,
    };
};

const validateEmail = (email) => {
    // Allows only alphanumeric characters, hyphens, and periods for email
    // Case insensitive
    if (!/^[a-z0-9.-]+@ufl\.edu$/i.test(email)) {
        return {
            valid: false,
            reason: "Invalid email address. Must be a @ufl.edu email!",
        };
    }
    return {
        valid: true,
    };
};

const validatePassword = (password) => {
    // Checks if its less than 8 characters
    if (password.length < 8) {
        return {
            valid: false,
            reason: "Password must be at least 8 characters!",
        };
    }

    // Limit password to 100 characters
    if (password.length > 100) {
        return {
            valid: false,
            reason: "Password must be less than 100 characters!",
        };
    }

    // Checks if there is an uppercase
    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            reason: "Password must contain an uppercase letter!",
        };
    }

    // Checks if there is a special character
    if (!/[~`! @#$%^&*()_\-+=\{[}\]\|\:;"'<,>\.\?/]/.test(password)) {
        return {
            valid: false,
            reason: "Password must contain a special character!",
        };
    }

    // Checks if there is a number
    if (!/[0-9]/.test(password)) {
        return {
            valid: false,
            reason: "Password must contain a number!",
        };
    }

    return {
        valid: true,
    };
};

module.exports = {
    validateUsername,
    validateEmail,
    validatePassword,
};
