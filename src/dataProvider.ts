import { DataProvider } from 'react-admin';
import { fetchUtils } from 'ra-core';
import simpleRestProvider from 'ra-data-simple-rest';




const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }

    const token = localStorage.getItem('token');
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    } else {
        console.log('No token available for request:', url);
    }
    
    return fetchUtils.fetchJson(url, options);
};


const myDataProvider: DataProvider = simpleRestProvider(apiUrl, httpClient);



export default myDataProvider;