import { checkEmailTaken, checkUsernameTaken } from "../api/authRequests";

const userNameRegex = /^[a-zA-Z0-9]+$/
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

/**
 * Tests if the username is valid. The username must be at least 4 characters, and only contain letters and numbers
 * @param username -> username to test
 * @throws Error if the username is invalid
 */
export const testUserName = (username: string) => {
    if (username.length < 4) {
        throw new Error("Username must be at least 4 characters");
    }
    if (!userNameRegex.test(username)) {
        throw new Error("Username can only contain letters and numbers");
    }
}


/**
 * Tests if the username is valid. The username must be between 8 and 128 characters, and only contain letters and numbers
 * 
 * @param password -> password to test
 * @throws Error if the password is invalid
 */
export const testPassword = (password: string) => {
    if (password.length < 8 || password.length > 128) {
        throw new Error("Password must be between 8 and 20 characters");
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        throw new Error("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        throw new Error("Password must contain at least one number");
    }
}

/**
 *  Tests if the email is valid. The email must be between 5 and 50 characters, contain no spaces, and be in a valid format
 * 
 * @param email -> email to test
 * @throws Error if the email is invalid
 */
export const testEmail = (email: string) => {
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }
    if (email.length < 5 || email.length > 50) {
        throw new Error("Email must be between 5 and 50 characters");
    }
    if (email.includes(" ")) {
        throw new Error("Email cannot contain spaces");
    }
}

/**
 * Tests if the username is already taken
 * @param username -> username to test
 * @throws Error if the username is already taken
 */
export const testUsernameTaken = async (username: string) => {
    await checkUsernameTaken(username).then((response) => {
        if (response.data.exists) {
            throw new Error("Username already taken");
        }
    });
}

/**
 * Tests if the email is already taken
 * @param email -> email to test
 * @throws Error if the email is already taken
 */
export const testEmailTaken = async (email: string) => {
    await checkEmailTaken(email).then((response) => {
        if (response.data.exists) {
            throw new Error("Email already taken");
        }
    });
}

export const testUserData = async (username: string, password: string, email: string) => {
    testUserName(username);
    testPassword(password);
    testEmail(email);
}

const InputValidator = {
    testUserData, testUserName, testPassword, testEmail, testUsernameTaken, testEmailTaken
}

export default InputValidator
