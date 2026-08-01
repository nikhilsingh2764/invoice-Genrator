import TryCatch from "../../middleware/TryCatch.js";
import RefreshTokenService from "../../service/auth/refreshToken.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

import { accessTokenOptions, refreshTokenOptions } from "../../utils/cookieOptions.js"


    ;
export const RefreshToken = TryCatch(async (req, res) => {

    console.log("Cookies:", req.cookies);

    const refreshToken = req.cookies.refreshToken;

    console.log("Refresh Token:", refreshToken);


    const { newAccessToken, newRefreshToken } = await RefreshTokenService(refreshToken);


    res.cookie(
        "accessToken",
        newAccessToken,
        accessTokenOptions
    );


    res.cookie(
        "refreshToken",
        newRefreshToken,
        refreshTokenOptions
    );



    return res.status(200).json(
        new ApiResponse(
            200,
            "Token refreshed successfully",
            null
        )
    );


});