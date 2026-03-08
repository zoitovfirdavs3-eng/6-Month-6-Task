const { globalError, ClientError } = require("shokhijakhon-error-handler");
const {
  registerValidator,
  profileVerifiedValidator,
  resendOtpOrForgotPasswordValidator,
  loginValidator,
  changePasswordValidator,
} = require("../utils/validators/user.validator");
const UserModel = require("../models/User/User.model");
const { hash, compare } = require("bcrypt");
const otpGenerator = require("../utils/generators/otp.generator");
const emailService = require("../lib/mailer.service");
const jwtService = require("../lib/jwt.service");
const {
  clientEncryption,
} = require("../../../../Exams/5-exam/src/models/User.model");

module.exports = {
  async REGISTER(req, res) {
    try {
      let newUser = req.body;
      await registerValidator.validateAsync(newUser, { abortEarly: false });
      let findUser = await UserModel.findOne({
        where: { email: newUser.email },
      });
      if (findUser) throw new ClientError("User already registered !", 409);
      newUser.password = await hash(newUser.password, 10);
      let { otp, otpTime } = otpGenerator();
      await emailService(newUser.email, otp);
      await UserModel.create({
        ...newUser,
        otp,
        otpTime,
      });
      return res
        .status(201)
        .json({ message: "User successfully registered !", status: 201 });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async VERIFY(req, res) {
    try {
      let profileData = req.body;
      await profileVerifiedValidator.validateAsync(profileData, {
        abortEarly: false,
      });
      let findUser = await UserModel.findOne({
        where: { email: profileData.email },
      });
      if (!findUser || findUser.isVerified)
        throw new ClientError("User not found, or already verified", 404);
      let currentData = Date.now();
      if (currentData > findUser.otpTime)
        throw new ClientError("OTP expired", 400);
      if (profileData.otp != findUser.otp)
        throw new ClientError("OTP invalid", 400);
      await UserModel.update(
        { isVerified: true },
        { where: { email: profileData.email } },
      );
      return res.json({
        message: "Profile successfully verified",
        status: 200,
      });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async RESEND_OTP(req, res) {
    try {
      let profileData = req.body;
      await resendOtpOrForgotPasswordValidator.validateAsync(profileData, {
        abortEarly: false,
      });
      let findUser = await UserModel.findOne({
        where: { email: profileData.email },
      });
      if (!findUser || findUser.isVerified)
        throw new ClientError("User not found or already activated", 404);
      let { otp, otpTime } = otpGenerator();
      await emailService(profileData.email, otp);
      await UserModel.update(
        { otp, otpTime },
        { where: { email: profileData.email } },
      );
      return res.json({ message: "OTP successfully resended" });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async LOGIN(req, res) {
    try {
      let profileData = req.body;
      await loginValidator.validateAsync(profileData, { abortEarly: false });
      let findUser = await UserModel.findOne({
        where: { email: profileData.email },
      });
      if (!findUser || !findUser.isVerified)
        throw new ClientError("User not found or not verified", 404);
      const checkPassword = await compare(
        profileData.password,
        findUser.password,
      );
      if (!checkPassword) throw new ClientError("User not found", 404);
      let refreshToken = jwtService.createRefreshToken({
        sub: findUser.id,
        role: findUser.role,
      });
      let accessToken = jwtService.createAccessToken({
        sub: findUser.id,
        role: findUser.role,
      });
      await UserModel.update(
        { refresh_token: refreshToken },
        { where: { email: profileData.email } },
      );
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 90,
      });
      return res.json({ message: "User successfully logged in", accessToken });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async REFRESH(req, res) {
    try {
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) throw new ClientError("Token not found", 404);
      const payload = jwtService.parseRefreshToken(refreshToken);
      let findUser = await UserModel.findOne({
        where: { id: payload.sub, refresh_token: refreshToken },
      });
      if (!findUser) throw new ClientError("Invalid refresh token", 403);
      const accessToken = jwtService.createAccessToken({
        sub: payload.sub,
        role: payload.role,
      });
      return res.json({
        message: "Access token successfully generated",
        status: 200,
        accessToken,
      });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async FORGOT_PASSWORD(req, res) {
    try {
      let profileData = req.body;
      await resendOtpOrForgotPasswordValidator.validateAsync(profileData, {
        abortEarly: false,
      });
      let findUser = await UserModel.findOne({
        where: { email: profileData.email },
      });
      if (!findUser || findUser.isVerified)
        throw new ClientError("User not found or user already activated", 404);
      let { otp, otpTime } = otpGenerator();
      await emailService(profileData.email, otp);
      await UserModel.update(
        { otp, otpTime },
        { where: { email: profileData.email } },
      );
      return res.json({ message: "Password successfully forgotten" });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async CHANGE_PASSWORD(req, res) {
    try {
      let profileData = req.body;
      await changePasswordValidator.validateAsync(profileData, {
        abortEarly: false,
      });
      let findUser = await UserModel.findOne({
        where: { email: profileData.email },
      });
      if (!findUser)
        throw new ClientError("User not found or already activated", 404);
      let hash_password = await hash(profileData.new_password, 10);
      await UserModel.update(
        { password: hash_password },
        { where: { email: profileData.email } },
      );
      return res.json({
        message: "Password successfully changed",
        status: 200,
      });
    } catch (err) {
      return globalError(err, res);
    }
  },
};
