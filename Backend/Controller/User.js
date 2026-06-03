import bcrypt from "bcrypt"
import User from "../Model/User.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import session from "../Model/Session.js"
import {sendEmail} from "../Service/email.service.js"
import {getOtpHtml, generateOtp} from "../utils/utils.js"
import otpModel from "../Model/Otp.js"
import Cloudinary from "../config/Cloudinary.js"

let tempUserData = {}; 

const signUp = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const html = getOtpHtml(otp);
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    //  save in DB
    await otpModel.deleteMany({ email, type: "signup" });
    await otpModel.create({
      email,
      otpHash,
      type: "signup",
      userName,
      hashedPassword,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`, html);
    return res.status(201).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const signIn = async (req,res) => {
    const {email,password} = req.body;
        try {
            const findUser = await User.findOne({email});

    if(!findUser){
        return res.status(400).json({message:"Invalid Email or password"})
    }

    if(!findUser.verified){
        return res.status(401).json({
            message:"Email not verified"
        })
    }

    if (!findUser.password) {
      return res.status(400).json({ message: "Please login with Google" });
    }

    const IsMatchedPassword = await bcrypt.compare(password,findUser.password)
    if(!IsMatchedPassword){
        return res.status(400).json({message:"Invalid Password"})
    }

    const refreshToken = jwt.sign({
        id: findUser.id
    }, process.env.JWT_SECRET,{expiresIn:"7d"})

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const sessionInfo = await session.create({
       user:findUser.id,
       refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: findUser._id,
        sessionId: sessionInfo.id
    }, process.env.JWT_SECRET,{expiresIn:"15m"})

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite : "lax",
        maxAge : 7 * 24 * 60 * 60 * 1000 // 7days
    })

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
});

    return res.status(200).json({
        message: "Login successful",
        user: {
         userName: findUser.userName,
        email: findUser.email,
        avatar: findUser.avatar,
        role : findUser.role 
         },
        });

    } catch (err) {
         console.log(err,);
        return res.status(400).json({message:"something went wrong"})      
    }
    
}

const getMe = async (req,res) => {
   const token = req.cookies.accessToken;

    if (!token) {
      return res.status(200).json({ user: null });
    }
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(200).json({ user: null });
    }

    return res.status(200).json({
        message:"user fetch successfully",
        user:{
            userName:user.userName,
            email:user.email,
            avatar : user.avatar,
            role: user.role
        }
    })
  } catch (err) {
    return res.status(401).json({ user: null });
  }
} 

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" })
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const sessionIdentify = await session.findOne({
    refreshTokenHash,
    revoked: false
  })

  if (!sessionIdentify) {
    return res.status(401).json({ message: "Invalid refresh token" })
  }

  const accessToken = jwt.sign(
    { id: decoded.id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  )

  const newRefreshToken = jwt.sign(
    { id: decoded.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
  sessionIdentify.refreshTokenHash = newRefreshTokenHash;
  await sessionIdentify.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000
  })

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  return res.status(200).json({
    message: "Token Refreshed Successfully"  
  })
}

   const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh Token not found" });
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const sessionItem = await session.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!sessionItem) {
    return res.status(400).json({ message: "Invalid refresh Token" });
  }

  sessionItem.revoked = true;
  await sessionItem.save();

  
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure:   true,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure:   true,
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Logged Out Successfully" });
};

const logOutAll = async (req,res) => {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(400).json({
                message:"Refresh Token not Found"
            })
        }

        const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET)

        await session.updateMany({
            user : decoded.id,
            revoked : false
        },{
            revoked:true
        })
        res.clearCookie("refreshToken")

        res.status(200).json({
            message:"Logged out from all devices successfully"
        })
    }

 const verifyEmail = async (req, res) => {
  const { otp, email } = req.body;

  // ✅ DB se lo
  const otpDoc = await otpModel.findOne({ email, type: "signup" });
  if (!otpDoc) {
    return res.status(400).json({ message: "OTP not found — resend karo" });
  }

  if (otpDoc.expiresAt < new Date()) {
    await otpModel.deleteMany({ email, type: "signup" });
    return res.status(400).json({ message: "OTP expired" });
  }

  
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  if (otpDoc.otpHash !== otpHash) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // ✅ User banao
  const user = await User.create({
    userName: otpDoc.userName,
    email: otpDoc.email,
    password: otpDoc.hashedPassword,
    verified: true,
  });

  // ✅ Cleanup
  await otpModel.deleteMany({ email, type: "signup" });

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

  return res.status(200).json({
    message: "Email verified successfully",
    user: { userName: user.userName, email: user.email, verified: user.verified },
  });
};

    // Google OAuth callback handler
// ✅ Pura fixed googleCallback
const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await session.create({
      user:      user._id,
      refreshTokenHash,
      ip:        req.ip,
      userAgent: req.headers["user-agent"],
    });

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // AccessToken cookie
res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure:   true,
  sameSite: "lax", 
  maxAge:   15 * 60 * 1000,
});

// RefreshToken cookie
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure:   true,
  sameSite: "lax", 
  maxAge:   7 * 24 * 60 * 60 * 1000,
});
    res.redirect(`${process.env.CLIENT_URL}/home`);
  } catch (err) {
    console.log(err);
    res.redirect("https://cart-square.vercel.app/signin?error=true");
  }
};

const profile = async (req,res) => {
    const userData = await User.findById(req.user.id).select("-password");

    if(!userData){
        return res.status(404).json({message:"User not found"})
    }

    res.status(200).json({
        message:"Profile fetch",
        userData
    })
}

const updatedAvtar = async (req,res) => {
  try {
    if(!req.file){
      return res.status(400).json({message:"No image uploaded"})
    }

    const uploadedAvtar = await Cloudinary.uploader.upload(req.file.path)

    const updateUser = await User.findByIdAndUpdate(req.user.id,
      {avatar : uploadedAvtar.secure_url},
      {new: true}
    )
    return res.status(200).json({message: "Avatar updated Successfully", updateUser})
  } catch (error) {
     console.log("Avatar not Updated",error);
       return res.status(500).json({message:"Avatar are Not Updated",err:error.message})
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Sirf check karo email exist karta hai
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not registered" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // ✅ otpModel mein save karo
    await otpModel.deleteMany({ email, type: "reset" });
    await otpModel.create({
      email,
      otpHash,
      type: "reset",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`,
      `<h1 style="letter-spacing:8px;color:#7c3aed;">${otp}</h1>`
    );

    return res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Step 2 — OTP verify
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // ✅ otpModel se dhundo
    const otpDoc = await otpModel.findOne({ email, type: "reset" });
    if (!otpDoc) return res.status(400).json({ message: "OTP not found" });

    if (otpDoc.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, otpDoc.otpHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    return res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Step 3 — Naya password set karo
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // ✅ otpModel se verify karo
    const otpDoc = await otpModel.findOne({ email, type: "reset" });
    if (!otpDoc) return res.status(400).json({ message: "OTP not found" });

    if (otpDoc.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, otpDoc.otpHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    // ✅ UserModel mein password update karo
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });

    // ✅ OTP delete karo
    await otpModel.deleteMany({ email, type: "reset" });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};




export default {signIn,signUp,getMe,refreshToken , logout,logOutAll,verifyEmail,googleCallback,profile,updatedAvtar, forgotPassword,resetPassword,verifyResetOtp}