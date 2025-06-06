import axios from "axios";

// Token functions
export const setToken = (token) => {
    if(token){
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }else{
        delete axios.defaults.headers.common["Authorization"];
    }
};

/*
export const getToken = () => {
    return sessionStorage.getItem('token');
};
export const clearToken = () => {
    sessionStorage.removeItem('token');
};
*/