let jwtService = require('../services/jwtservice');
let User = require('../models/user');
let userDTO = require('../DTOs/user');

let auth = async (req, resp, next) =>{
    try {
        //validate both tokens
    let {accessToken, refreshToken} = req.cookies;
    if(!refreshToken || !accessToken){
        let error = {
            status:401,
            message:'unauthorized',
        }
        return next(error);
    }

    //Verify access token
    let _id;
    try {
        let verifyAccessToken = jwtService.verifyAccessToken(accessToken);
    } catch (error) {
        return next(error);
    }

    next();

    } catch (error) {
        return next(error);
    }



};

module.exports = auth;