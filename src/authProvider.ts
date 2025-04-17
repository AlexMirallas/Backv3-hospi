import { AuthProvider } from "react-admin";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "./types/types";



const apiUrl =  import.meta.env.VITE_API_URL || 'http://localhost:3000';

const authProvider: AuthProvider = {

    login: async ({ email, password }) => {
        try {
            console.log('Login attempt with:', { email, password: '********' });
            const request = new Request(`${apiUrl}/auth/login`, {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: new Headers({ "Content-Type": "application/json" }),
            });
            
            const response = await fetch(request);
            console.log('Response status:', response.status);
            
            // Clone the response for debugging
            const responseClone = response.clone();
            
            if (response.status < 200 || response.status >= 300) {
                // Log the full response for debugging
                const responseText = await responseClone.text();
                console.error('Error response body:', responseText);
                
                let errorMessage = "Authentication failed";
                try {
                    const errorJson = JSON.parse(responseText);
                    errorMessage = errorJson.message || errorMessage;
                } catch (e) {
                    errorMessage = responseText || errorMessage;
                }
                
                throw new Error(errorMessage);
            }
            
            
            const responseJson = await response.json();
            console.log('Response structure:', Object.keys(responseJson));
            
            if (!responseJson.accessToken) {
                throw new Error("No access token received from server");
            }
            
            
            localStorage.setItem("token", responseJson.accessToken);
            
            
            const decodedToken = jwtDecode<CustomJwtPayload>(responseJson.accessToken);
            console.log('Decoded token (partial):', {
                email: decodedToken.email,
                sub: decodedToken.sub,
                roles: decodedToken.roles,
                exp: new Date(decodedToken.exp * 1000).toISOString()
            });
            
            
            if (decodedToken && decodedToken.roles) {
                localStorage.setItem("permissions", JSON.stringify(decodedToken.roles));
            }
            
            return Promise.resolve();
        } catch (error) {
            console.error("Login error:", error);
            return Promise.reject(error instanceof Error ? error : new Error("Unknown authentication error"));
        }
    },

  
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("permissions");
        return Promise.resolve();
    },

  
    checkError: (error) => {
        const status = error?.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("permissions");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    
    checkAuth: () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            return Promise.reject({ redirectTo: "/login" });
        }
        
        
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                localStorage.removeItem("token");
                localStorage.removeItem("permissions");
                return Promise.reject({ redirectTo: "/login" });
            }
        } catch (error) {
            console.error("Token validation error:", error);
            localStorage.removeItem("token");
            return Promise.reject({ redirectTo: "/login" });
        }
        
        return Promise.resolve();
    },

   
    getPermissions: () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            return Promise.reject();
        }
        
        try {
            
            const storedPermissions = localStorage.getItem("permissions");
            if (storedPermissions) {
                return Promise.resolve(JSON.parse(storedPermissions));
            }
            
           
            const decodedToken = jwtDecode<CustomJwtPayload>(token);
            return Promise.resolve(decodedToken.roles || []);
        } catch (error) {
            console.error("Error getting permissions:", error);
            return Promise.resolve([]);
        }
    },
    
    
    getIdentity: () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            return Promise.reject();
        }
        
        try {
            const decodedToken = jwtDecode<CustomJwtPayload>(token);
            
            // Ensure id is not undefined, with fallback to empty string
            const userId = decodedToken.sub || '';
            
            return Promise.resolve({
                id: userId,
                fullName: decodedToken.email || "User",
                clientId: decodedToken.clientId || null,
            } as any); 
        } catch (error) {
            console.error("Error getting identity:", error);
            return Promise.reject(error);
        }
    }
};

export default authProvider;