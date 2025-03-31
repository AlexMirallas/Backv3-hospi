import { DataProvider } from 'react-admin';
import { fetchUtils } from 'ra-core';
import simpleRestProvider from 'ra-data-simple-rest';


// API URL - update this to match your NestJS API
const apiUrl = 'http://localhost:3000';

// Custom fetch with auth token
const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    
    // Add the authentication token to each request
    const token = localStorage.getItem('token');
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
        console.log('Adding token to request:', url);
    } else {
        console.log('No token available for request:', url);
    }
    
    return fetchUtils.fetchJson(url, options);
};

// Create the data provider using ra-data-simple-rest
const myDataProvider: DataProvider = simpleRestProvider(apiUrl, httpClient);

export default myDataProvider;