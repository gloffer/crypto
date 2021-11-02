import axios from 'axios';

// eslint-disable-next-line no-undef
const { REACT_APP_BE_URL: API_URL } = process.env

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}get_user`;
export const LOGIN_URL = `${API_URL}auth_token`;
export const REGISTER_URL = `${API_URL}auth/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}auth/forgot-password`;
// Server should return AuthModel
export function login(email, password) {
    return axios.post(LOGIN_URL, { 'email': email, 'password': password });
}
// Server should return AuthModel
export function register(email, firstname, lastname, password) {
    return axios.post(REGISTER_URL, {
        email,
        firstname,
        lastname,
        password,
    });
}
// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email) {
    return axios.post(REQUEST_PASSWORD_URL, { email });
}
export function getUserByToken() {
    // Authorization head should be fulfilled in interceptor.
    // Check common redux folder => setupAxios
    return axios.get(GET_USER_BY_ACCESSTOKEN_URL);
}
