import { GoogleLogin } from "@react-oauth/google";
import api from "../../api/axios"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth.store";



const GoogleLoginButton = () => {

    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {

        try {

            const response = await api.post("/google", {
                idToken: credentialResponse.credential
            });

            console.log(response.data);

            // save user in Zustand
            login(response.data.data);


            // redirect home
            navigate("/");

        } catch (error) {

            console.error(error.response?.data || error);

        }

    };

    const handleGoogleError = () => {

        console.log("Google Login Failed");

    };

    return (
        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
        />
    );

};

export default GoogleLoginButton;