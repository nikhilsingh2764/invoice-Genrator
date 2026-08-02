import { create } from "zustand";

import {
    logout as logoutService
} from "../services/auth.service";



const getStoredUser = () => {

    try {

        const user = localStorage.getItem("user");


        if (!user || user === "undefined") {
            return null;
        }


        return JSON.parse(user);


    } catch(error) {

        console.log(
            "Local storage parse error:",
            error
        );

        localStorage.removeItem("user");

        return null;

    }

};





const useAuthStore = create((set) => ({


    user: getStoredUser(),



    isAuthenticated:
        !!getStoredUser(),



    isLoading:false,





    login:(user)=>{


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );



        set({

            user,

            isAuthenticated:true,

            isLoading:false

        });


    },







    setUser:(user)=>{


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );



        set({

            user,

            isAuthenticated:true

        });


    },







    logout:async()=>{


        try{


            await logoutService();


        }
        catch(error){


            console.log(
                "Logout error:",
                error
            );


        }
        finally{


            localStorage.removeItem("user");



            set({

                user:null,

                isAuthenticated:false,

                isLoading:false

            });


        }


    }



}));


export default useAuthStore;