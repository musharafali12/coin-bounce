const Joi = require("joi");
let User = require("../models/user");
let bcrypt = require("bcryptjs");
let userDTO = require("../DTOs/user");
let jwtService = require("../services/jwtservice");
const Token = require("../models/token");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

let authController = {
  async register(req, resp, next) {
    let registerSchema = Joi.object({
      username: Joi.string().min(3).max(5).required(),
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    let { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    //check if user is already registered
    let { name, username, email, password } = req.body;
    try {
      let userNameInUse = await User.exists({ username });
      let emailInUse = await User.exists({ email });

      if (userNameInUse) {
        let error = {
          message: "Username already exists",
        };
        return next(error);
      }

      if (emailInUse) {
        let error = {
          message: "Email already exists",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //If user is unique, hash password
    let hashedPassword = await bcrypt.hash(password, 10);

    //store data in database
    let userData;
    let accessToken;
    let refreshToken;
    try {
      let userToRegister = new User({
        name,
        username,
        email,
        password: hashedPassword,
      });

      userData = await userToRegister.save();

      // generate Access token
      accessToken = jwtService.signAccessToken({ userId: userData._id }, "30m");

      //generate Refresh token
      refreshToken = jwtService.signRefreshToken(
        { userId: userData._id },
        "60m"
      );
    } catch (error) {
      return next(error);
    }

    // store refresh token in database
    jwtService.storeRefreshToken(userData._id, refreshToken);

    //send tokens in cookies
    resp.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    resp.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    //send response to user

    let userDTOData = new userDTO(userData);

    resp.status(201).json({ user: userDTOData, auth: true });
  },

  //login API
  async login(req, resp, next) {
    let { username, password } = req.body;
    let userNameInfo;
    let matchPass;
    try {
      userNameInfo = await User.findOne({ username });

      if (!userNameInfo) {
        return resp.status(401).json({ message: "username is incorrect" });
      }

      //hash password and compare
      matchPass = await bcrypt.compare(password, userNameInfo.password);

      if (!matchPass) {
        let error = {
          status: "401",
          message: "password does not match",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //generate access and refesh tokens
    let accessToken = jwtService.signAccessToken(
      { id: userNameInfo._id },
      "30min"
    );
    let refreshToken = jwtService.signRefreshToken(
      { id: userNameInfo._id },
      "60min"
    );
    //update refresh token
    try {
      await Token.updateOne(
        { _id: userNameInfo._id },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    //send response back to user

    resp.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    resp.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    let userDTOData = new userDTO(userNameInfo);

    console.log(userDTOData);

    resp.status(200).json({ user: userDTOData, auth: true });
  },

  //logout API
  async logout(req, resp, next) {
    // delete refresh token
    let { refreshToken } = req.cookies;

    try {
      await Token.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    //delete cookies
    resp.clearCookie("accessToken");
    resp.clearCookie("refreshToken");

    //send response
    resp.status(200).json({ user: null, auth: false });
  },

  //refresh access token
  async refresh(req, resp, next) {
    let originalRefreshToken = req.cookies.refreshToken;
    //verify refresh token
    let id;
    try {
      id = jwtService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (error) {
      return next(error);
    }
    //find refresh token in database
    try {
      let match = Token.findOne({ userId: _id, token: originalRefreshToken });
      if (!match) {
        let error = {
          status: 401,
          message: "Unauthorized",
        };
      }
      return next(error);
    } catch (error) {
      return next(error);
    }
    //generate new access and refrsh tokens

    try {
      let refreshToken = jwtService.signRefreshToken({ _id: id }, "60min");
      let accessToken = jwtService.signAccessToken({ _id: id }, "30min");

      await Token.updateOne({ _id: id }, { token: refreshToken });

      resp.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      resp.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = authController;
