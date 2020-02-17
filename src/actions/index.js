import axios from 'axios';
import History from '../history.js';
import {
    AUTH_USER,
    UNAUTH_USER,
    AUTH_ERROR,
    FETCH_FEATURE
} from './types';

const ROOT_URL = 'http://127.0.0.1:3090';


export const signinUser = ({ username, password }) => {
    return (dispatch) => {
        // submit email/password to the server
        axios.post(`${ROOT_URL}/api-token-auth/`, { username: username, password: password })
            .then(response => {

                // if request is good...
                // - update state to indicate user is authenticated
                dispatch({ type: AUTH_USER });

                // - save the jwt token
                localStorage.setItem('token', response.data.token);

                // - redirect to the route '/feature'
                History.push('/feature');

            }).catch(() => {
                // if request is bad...
                // - show an error to the user
                dispatch(authError('Bad Login Info'));
            });
    };
};

export const signupUser = ({ username, password }) => {
    return (dispatch) => {
        // submit email/password to the server
        axios.post(`${ROOT_URL}/signup`, { username, password })
            .then(response => {
                dispatch({ type: AUTH_USER });
                localStorage.setItem('token', response.data.token);
                History.push('/feature');
            })
            .catch(err => {
                dispatch(authError(err.response.data.error));
            });
    };
};

export const authError = (error) => {
    return {
        type: AUTH_ERROR,
        payload: error
    };
};

export const signoutUser = () => {
    localStorage.removeItem('token')
    return { type: UNAUTH_USER };
};

export const fetchFeature = () => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    return (dispatch) => {
        axios.get(`${ROOT_URL}/users/`)
        .then(response =>{
            dispatch({
                type: FETCH_FEATURE,
                payload: response.data
             });
        });
    };
};
