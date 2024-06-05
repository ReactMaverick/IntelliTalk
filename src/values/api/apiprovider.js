import axios from "axios";
import { handleError, handleResponse } from "./apihelper";

// For headers
const getHeaders = (token, formData) => {
    return {
        "Content-Type": formData ? "multipart/form-data" : "application/json",
        "Authorization": token ? `Bearer ${token}` : ''
    };
};

// Fetch data
export const getData = (apiUrl, token) => {
    const headers = getHeaders(token);

    return axios
        .get(apiUrl, { headers })
        .then(handleResponse)
        .catch(handleError);
};

// Post data
export const postData = (apiUrl, data, token) => {
    const headers = getHeaders(token);

    // console.log('Headers ==> ', headers);
    // console.log('Api Url ==> ', apiUrl);
    // console.log('Data ==> ', data);
    // console.log('Token ==> ', token);

    return axios
        .post(apiUrl, data, { headers })
        .then(handleResponse)
        .catch(handleError);
};

// Post Form data
export const postFormData = (apiUrl, data, token) => {
    const headers = getHeaders(token, data);

    return axios
        .post(apiUrl, data, { headers })
        .then(handleResponse)
        .catch(handleError);
};