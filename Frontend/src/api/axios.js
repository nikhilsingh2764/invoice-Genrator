import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },

    timeout: 10000,
    
});


// Creates a reusable Axios instance. prevent repeating baseURL, headers and configuration in every API-call
////Sends cookies automatically with every request.
//// Sets default HTTP headers for every request. //saying to backend we are sending JSON


// ==============================
// Response Interceptor
// ==============================

api.interceptors.response.use(

    (response)=>response,


    async(error)=>{


        const originalRequest = error.config;


        if(
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/profile") &&
            !originalRequest.url.includes("/login") &&
            !originalRequest.url.includes("/signup")
        ){


            originalRequest._retry=true;


            try{


                await api.post("/refresh-token");


                return api(originalRequest);


            }
            catch(refreshError){


                return Promise.reject(refreshError);


            }

        }



        return Promise.reject(error);


    }

);

export default api;