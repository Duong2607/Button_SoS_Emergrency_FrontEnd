import axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';
// import { useLogin } from '../context/LoginProvider';



const client = axios.create({
    // baseURL: process.env.REACT_APP_BACKEND_URL,
    baseURL: "http://192.168.1.64:5000/api",

    // withCredentials: true
});


let refresh = false;

client.interceptors.response.use(resp => resp.data, async error => {
    console.log('ppp', error);
    // console.error('ppp', error)
    if (error.response.status == 401 && !refresh) {
        refresh = true;

        const response = await refreshToken();
        if (response.status == 200) {
            // if (response.accessToken) {
            setCookie('accessToken', response.data.accessToken);
            return client(error.response.config);
            // }
            // client.defaults.headers.common['Authorization'] = `Bearer ${response.data['token']}`;

        }
    }
    // if (error.response.status == 401 && !refresh) {
    //     refresh = true;

    //     const response = await refreshToken();
    //     if (response.status == 200) {
    //         // if (response.accessToken) {
    //         setCookie('accessToken', response.data.accessToken);
    //         return client(error.response.config);
    //         // }
    //         // client.defaults.headers.common['Authorization'] = `Bearer ${response.data['token']}`;

    //     }
    // }
    refresh = false;
    return error;
});
//     (response) => {
//         return response.data;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         // Check if the error is due to expired token
//         if (error.response) {
//             if (error.response.status === 401 && !originalRequest._retry) {
//                 originalRequest._retry = true;

//                 // Refresh the token
//                 const newToken = await refreshToken();
//                 console.log('new', newToken);
//                 // Update the authorization cookie
//                 setCookie('accessToken', newToken);

//                 // Retry the original request
//                 return client(originalRequest);
//             }
//         }


//         return Promise.reject(error);
//     }
// );

// Function to refresh the token
const refreshToken = async () => {
    try {
        // Implement your refresh token logic here
        // Make a request to your server to refresh the token
        const response = await axios.post(`http://192.168.1.64:5000/api/auth/refresh`, {});
        console.log('refe', response.data);
        // Return the new token
        return response;
    } catch (error) {
        // Handle refresh token error
        console.error('Error refreshing token', error);
        throw error;
    }
};

// Function to get a specific cookie value
const getCookie = async (cookieName) => {
    await CookieManager.get('http://192.168.1.64')
        .then((cookies) => {
            if (cookies[cookieName]) {
                const targetCookie = cookies[cookieName].value;
                return targetCookie ? targetCookie.value : null;
            }


        });;

};

// Function to set a cookie
const setCookie = (cookieName, cookieValue) => {
    // cookieJar.setCookie(`${cookieName}=${cookieValue}`, API_BASE_URL);
    CookieManager.set('http://192.168.1.64', {
        name: "accessToken",
        value: cookieValue,
        path: '/',
        version: '1',
        sameSite: "strict",
        secure: false,
        // expires: '2015-05-30T12:30:00.00-05:00'
    }).then((done) => {
        console.log('CookieManager.set =>', done);
    })
        .catch((err) => {
            console.log('lỗi', err);
        })
};



export default client;
