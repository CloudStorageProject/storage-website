import { getUsersByUsername } from "../api/authRequests";

export const getUsers = async (username, size) => {
    return await getUsersByUsername(username, size).then((response) => {
        return { data: response.data, error: null }
    }).catch((error) => {
        return { data: null, error: error }
    });
}