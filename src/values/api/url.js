// export const API_URL = 'http://192.168.29.198:4006/wanderInn/api/v1/'; //Localhost IP Priyam
// export const API_URL = 'http://192.168.29.39:4006/wanderInn/api/v1/'; //Localhost IP Saikat
// export const API_URL = 'http://194.163.131.163:4006/wanderInn/api/v1/'; //Server IP

export const BASE_URL = 'http://194.163.131.163:4008';

export const API_URL = BASE_URL + '/intelliTalks/api/v1/'; //Server IP

export const IMAGE_BASE_URL = BASE_URL + '/intelliTalks/';

export const REGISTER_URL = `${API_URL}register`;

export const LOGIN_URL = `${API_URL}login`;

export const VERIFY_OTP_URL = `${API_URL}verifyOTP`;

export const UPDATE_USER_URL = (id) => `${API_URL}updateUser/${id}`;

export const FORGOT_PASSWORD_URL = `${API_URL}forgotPassword`;

export const GET_USER_URL = `${API_URL}getUser`;

export const CHAT_WITH_AI_URL = `https://api.openai.com/v1/chat/completions`;