import { googleLoginService } from "../../service/auth/googleAuth.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import TryCatch from "../../middleware/TryCatch.js";

export const googleLoginController = TryCatch(async (req, res) => {

    const { idToken } = req.body;

    const result = await googleLoginService(idToken);


    res.cookie(
        "accessToken",
        result.accessToken,
        {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }
    );


    res.cookie(
        "refreshToken",
        result.refreshToken,
        {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }
    );


    res.status(200).json(
        new ApiResponse(
            200,
            "Google Login Successful",
            result.user
        )
    );

});