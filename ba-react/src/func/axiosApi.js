import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'https://better-ath-django.herokuapp.com/api/',
    timeout: 5000,
    headers: {
        'Authorization': "JWT " + localStorage.getItem('token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});
