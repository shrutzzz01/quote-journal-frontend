import API from './api';

export const login = async (email, password) => {
    const response = await API.post('/auth/login', {email, password});
    const {token}=response.data;
    localStorage.setItem('token', token);
    return token;
};

export const register=async(name, email, password) => {
    const response=await API.post('/auth/register', {name, email, password});
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
}

export const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        // Split by the dot and take the middle part (Payload)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix URL encoding
        const payload = JSON.parse(window.atob(base64));

        console.log('Decoded Payload:', payload);

        // Spring Security often puts roles in 'role', 'roles', or 'sub'
        return payload.role || payload.roles || payload.authorities?.[0];
    } catch (e) {
        console.error("JWT Decode Error:", e);
        return null;
    }
};