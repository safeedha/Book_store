const User = require('../Model/User');
const OtpModel = require('../Model/Otp');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// const ACCESS_TOKEN_SECRET = 'your-access-token-secret';
// const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret';

const otpGeneration = async (email) => {
  try {
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    const exist = await OtpModel.findOne({ email });

    if (exist) {
      const update = await OtpModel.updateOne(
        { email },
        { $set: { otp: otp, createdAt: Date.now() } }
      );
    } else {
      const newOtp = await OtpModel.create({ email, otp });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: 'lfyk ynde oime hser',
      },
    });

    await transporter.sendMail({
      from: 'mksafeedha@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for verification is: ${otp}`,
    });

    console.log('otp sented');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        'OTP generation or email sending failed: ' + error.message
      );
    }

    throw new Error('Unknown error occurred during OTP process');
  }
};

const userSignup = async (req, res, next) => {
  try {
    const { name, email, password, mobileNo } = req.body;

    const existingmail = await User.findOne({ email: email });

    if (existingmail) {
      return res
        .status(409)
        .json({ message: 'this mail already exist use different mail' });
    }
    const existingnumber = await User.findOne({ mobileNo: mobileNo });
    if (existingnumber) {
      return res
        .status(409)
        .json({ message: 'This number alredy registerd one' });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: passwordHash,
      mobileNo: mobileNo,
    });

    await otpGeneration(email);

    res
      .status(201)
      .json({
        message: 'acoount created suceesfully please verify Your mail',
        user,
      });
  } catch (error) {
    next(error);
  }
};

const otpVerification = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const exist = await OtpModel.findOne({ email });

    if (!exist) {
      return res
        .status(404) 
        .json({ message: 'Your OTP validity has expired. Please resend it.' });
    }

    if (exist.otp === otp) {
      const userUpdate = await User.updateOne(
        { email },
        { $set: { email_verified: true } }
      );

      if (userUpdate.modifiedCount > 0) {
        return res
          .status(200) 
          .json({ message: 'OTP verification successful, email verified.' });
      } else {
        return res
          .status(500) 
          .json({ message: 'Failed to update user email status.' });
      }
    } else {
      return res
        .status(401) 
        .json({ message: 'Invalid OTP. Please try again.' });
    }
  } catch (error) {
    next(error);
  }
};

const otpResend = async (req, res, next) => {
  try {
    const { email } = req.body;
    await otpGeneration(email);
    return res
      .status(200)
      .json({ message: 'OTP has been resent successfully' });
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { profile } = req.body;
    const {
      id,
      email,
      verified_email,
      name,
      given_name,
      family_name,
      picture,
    } = profile;
    const existing = await User.findOne({ googleId: id });
    if (existing) {
      return res
        .status(200)
        .json({ message: 'user already exist', user: existing });
    }
    const user = await User.create({
      name: name,
      googleId: id,
      email: email,
      email_verified: verified_email,
    });
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('user_accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('user_refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: 'user accoubt created sucessfully', user });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const available = await User.findOne({ email });

    if (!available) {
      return res.status(401).json({ message: 'Invalid email and password' });
    }
    if (available.email_verified === false) {
      await otpGeneration(email);
      return res.status(401).json({ message: 'Email not verified' });
    }

    const passwordMatch = await bcrypt.compare(password, available.password);

    if (passwordMatch) {
      if (available.status === 'block') {
        return res
          .status(403)
          .json({
            message:
              'Your account has been temporarily blocked. Please try again later.',
          });
      }

      const accessToken = jwt.sign(
        { id: available._id, email: available.email, role: available.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { id: available._id, email: available.email, role: available.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('user_accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('user_refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ message: 'User authenticated', user: available });
    } else {
      return res.status(400).json({ message: 'Invalid email and password' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userSignup,
  otpVerification,
  otpResend,
  googleLogin,
  userLogin,
  otpGeneration,
};
