import { CONFLICT_CODE, ERROR_CODE, RESOURCE_CREATED_CODE, SUCCESS_CODE, UNAUTHORIZED_ERROR_CODE } from "./statusCodes";

export const handleResponse = response => {
    console.log('Response ==> ', response.data);
    if (response.data.code === SUCCESS_CODE || response.data.code === RESOURCE_CREATED_CODE) {
        response.data.isSuccess = true;
    } else {
        response.data.isSuccess = false;
    }

    return response.data;
};

export const handleError = (error) => {
    console.log('Error ==> ', error);
    if (error?.response?.data?.code === ERROR_CODE || error?.response?.data?.code === UNAUTHORIZED_ERROR_CODE || error?.response?.data?.code === CONFLICT_CODE) {
        return error.response.data;
    } else {
        // console.log('Error message:', error.response.data);
        return error.message;
    }
};

