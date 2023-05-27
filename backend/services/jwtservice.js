let jwt = require('jsonwebtoken');
let {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('../config/config');
let Token = require('../models/token');

let jwtService = {
    //method for creating access token
    signAccessToken(payload, expiryTime){
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn:expiryTime});
    },

    //method for creating refresh token
    signRefreshToken(payload, expiryTime){
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn:expiryTime});
    },

    //Verify access token
    verifyAccessToken(token){
        return jwt.verify(token, ACCESS_TOKEN_SECRET)
    },

    //Verify access token
    verifyRefreshToken(token){
        return jwt.verify(token, REFRESH_TOKEN_SECRET)
    },

    //method for storing refresh token in database
    async storeRefreshToken(userId, token){
        try {
            let tokenModel = new Token({
                userId: userId,
                token:token,
            });

            let saveRefreshToken = await tokenModel.save();

        } catch (error) {
            return next(error);
        }
    }
}

module.exports = jwtService;