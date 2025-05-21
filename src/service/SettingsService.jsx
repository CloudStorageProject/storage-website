import { SetPasswordRequest, SetUsernameRequest, GetPaymentsRequest, SetPaymentRequest } from "../api/SettingsRequests.jsx";


export const changePassword = async (old_password, new_password) => {
    return await SetPasswordRequest(old_password, new_password).then((response) => {
        return { data: response.data, error: null }
    }).catch((error) => {
        return { data: null, error: error }
    });
}

export const changeUsername = async (old_password, new_username) => {
    return await SetUsernameRequest(old_password, new_username).then((response) => {
        return { data: response.data, error: null }
    }).catch((error) => {
        return { data: null, error: error }
    });
}

export const getPayments = async () => {
    return await GetPaymentsRequest().then((response) => {
        return { data: response.data, error: null }
    }).catch((error) => {
        return { data: null, error: error }
    });
}

export const changePayment = async (plan) => {
    return await SetPaymentRequest(plan).then((response) => {
        return { data: response.data, error: null }
    }).catch((error) => {
        return { data: null, error: error }
    });
}