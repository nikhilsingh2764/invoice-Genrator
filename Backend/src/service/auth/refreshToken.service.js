import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError.js";
import userRepository from "../../repository/auth/user.repository.js";
import generateToken from "../../utils/generateToken.js";
import refreshTokenRepository from "../../repository/auth/refreshToken.repository.js";


const RefreshTokenService = async (refreshToken) => {


    // Check refresh token exists
    if (!refreshToken) {
        throw new ApiError(
            401,
            "Refresh token is missing"
        );
    }

    console.log("STEP 1 - refresh token received");



    // Verify refresh token
    let decoded;

    try {

        decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        console.log("STEP 2 - decoded:", decoded);

    } catch (error) {
        console.log("JWT ERROR:", error.message);

        throw new ApiError(
            401,
            "Invalid refresh token"
        );

    }



    // Check token exists in database

    console.log("Incoming token length:", refreshToken.length);


    const storedToken = await refreshTokenRepository.findByToken(
        refreshToken
    );

    console.log("STEP 3 - Stored Token:", storedToken);

    if (!storedToken) {

        throw new ApiError(
            401,
            "Refresh token expired or revoked"
        );

    }



    // Find user

    const user = await userRepository.findById(decoded.id);

    console.log("STEP 4 - User:", user);

    if (!user) {

        throw new ApiError(
            401,
            "User not found"
        );

    }



    // Check active account

    if (!user.isActive) {

        throw new ApiError(
            403,
            "Account is deactivated"
        );

    }



    // Delete old refresh token

  const deleted =  await refreshTokenRepository.deleteByToken(
        refreshToken
    );

console.log("Deleted:", deleted);

    // Generate new access token

    const newAccessToken =
        generateToken(
            {
                id: user._id,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            process.env.ACCESS_TOKEN_EXPIRES_IN
        );




    // Generate new refresh token

    const newRefreshToken =
        generateToken(
            {
                id: user._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            process.env.REFRESH_TOKEN_EXPIRES_IN
        );




    // Save new refresh token

    await refreshTokenRepository.create({

        userId: user._id,

        token: newRefreshToken,

        expiresAt: new Date(
            Date.now() +
            15 * 24 * 60 * 60 * 1000
        )

    });



    return {

        newAccessToken,

        newRefreshToken

    };


};


export default RefreshTokenService;