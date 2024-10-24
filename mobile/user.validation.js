function validateUsername(username) {
    try {
        //allows only alphanumeric characters, hyphens and periods for email
        //Case insensitive
        if (!/^[a-z0-9.-]+@ufl\.edu$/i.test(username)) {
            throw new Error('Invalid email address. Must be a @ufl.edu email');
        }

        //limited username to 100 characters
        if (username.length > 100) {
            throw new Error('Username must be less than 100 characters');
        }

        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}


function validatePassword(password) {
    try {
        //Checks its less than 8 characters
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters')
        }
        //Limited password to 100 characters
        if (password.length > 100) {
            throw new Error('Password must be less than 100 characters')
        }
        //checks if there is a uppercase
        if (!/[A-Z]/.test(password)){
            throw new Error("Password must contain a Uppercase letter")
        }
        
        //checks if there is a special character
        if (!/[~`! @#$%^&*()_\-+=\{[}\]\|\:;"'<,>\.\?/]/.test(password)){
            throw new Error("Password must contain a Special character")
        }
        //checks if there is a number
        if (!/[0-9]/.test(password)){
            throw new Error("Password must contain a Number")
        }
    
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

function validateName(name){
    try {
        //limited name to 100 characters
        if (name.length > 100) {
            throw new Error('Name must be less than 100 characters');
        }
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}
testname = "shaun"
console.log(validateName(testname))

testusername = "shAun.h@uFl.EDU"
console.log(validateUsername(testusername))


testpassword = "@A12345678"
console.log(validatePassword(testpassword))