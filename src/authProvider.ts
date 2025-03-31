import { AuthProvider } from "react-admin";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
    email: string;
    sub: string;
    roles: string[];
    iat: number;
    exp: number;
    avatar?: string;
    // Add any other properties your token contains
}
// API URL - update this to match your NestJS API
const apiUrl =  "http://localhost:3000";

const authProvider: AuthProvider = {
    // Login: send credentials to the NestJS API and store the returned JWT
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
                    // If it's not valid JSON, use the raw text
                    errorMessage = responseText || errorMessage;
                }
                
                throw new Error(errorMessage);
            }
            
            // Parse the success response
            const responseJson = await response.json();
            console.log('Response structure:', Object.keys(responseJson));
            
            if (!responseJson.accessToken) {
                throw new Error("No access token received from server");
            }
            
            // Store token in localStorage
            localStorage.setItem("token", responseJson.accessToken);
            
            // Decode token to get user information
            const decodedToken = jwtDecode<CustomJwtPayload>(responseJson.accessToken);
            console.log('Decoded token (partial):', {
                email: decodedToken.email,
                sub: decodedToken.sub,
                roles: decodedToken.roles,
                exp: new Date(decodedToken.exp * 1000).toISOString()
            });
            
            // Store user roles if available
            if (decodedToken && decodedToken.roles) {
                localStorage.setItem("permissions", JSON.stringify(decodedToken.roles));
            }
            
            return Promise.resolve();
        } catch (error) {
            console.error("Login error:", error);
            return Promise.reject(error instanceof Error ? error : new Error("Unknown authentication error"));
        }
    },

    // Logout: clear all stored authentication data
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("permissions");
        return Promise.resolve();
    },

    // Check for authentication errors in API responses
    checkError: (error) => {
        const status = error?.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("permissions");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    // Check if user is authenticated (called when the user navigates)
    checkAuth: () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            return Promise.reject({ redirectTo: "/login" });
        }
        
        // Optional: Verify token hasn't expired
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

    // Get user permissions (roles) from the token
    getPermissions: () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            return Promise.reject();
        }
        
        try {
            // First try to get from localStorage
            const storedPermissions = localStorage.getItem("permissions");
            if (storedPermissions) {
                return Promise.resolve(JSON.parse(storedPermissions));
            }
            
            // Fallback to decoding the token
            const decodedToken = jwtDecode<CustomJwtPayload>(token);
            return Promise.resolve(decodedToken.roles || []);
        } catch (error) {
            console.error("Error getting permissions:", error);
            return Promise.resolve([]);
        }
    },
    
    // Get user identity for display purposes
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
                avatar: decodedToken.avatar,
            } as any); 
        } catch (error) {
            console.error("Error getting identity:", error);
            return Promise.reject(error);
        }
    }
};

export default authProvider;