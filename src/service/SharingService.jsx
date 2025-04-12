import { getUsersByUsername } from "../api/authRequests";
import { allowFileSharingRequest, deleteFileSharingRequest } from "../api/FileRequests";

export const getUsers = async (username, size) => {
    return await getUsersByUsername(username, size).then((response) => {
        return { data: response.data, error: null }
    }).catch((error) => {
        return { data: null, error: error }
    });
}

export const grantAccess = async (user, file, data) => {
    return await allowFileSharingRequest(file.file_id, user.id, data).then((response) => {
        return { data: response.data, error: null }
    }).catch((error) => {
        return { data: null, error: error }
    });
}

export const revokeAccess = async (user, file) => {
    return await deleteFileSharingRequest(file.file_id, user.id).then((response) => {
        return { data: response.data, error: null }
    }).catch((error) => {
        return { data: null, error: error }
    });
}