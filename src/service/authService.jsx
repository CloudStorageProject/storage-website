import { loginRequest, registerRequest } from "../api/authRequests";

/**
 * Logs in a user with the server.
 * @param {Object} data - The user to register
 * @param {string} data.username - The user's username
 * @param {string} data.password - The user's password
 * @returns {Promise} - The response from the server
 */
export const login = async (data) => {
    return await loginRequest(data);
}

/**
 * Registers a user with the server.
 * @param {Object} data - The user to register
 * @param {string} data.name - The user's name
 * @param {string} data.username - The user's username
 * @param {string} data.email - The user's email
 * @param {string} data.password - The user's password
 * @returns {Promise} The response from the server
 */
export const register = async (data) => {
    return await registerRequest(data);
}
