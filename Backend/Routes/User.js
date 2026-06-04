import express from "express"
import User from "../Controller/User.js"
import passport from "../config/Passport.js"
import verifyToken from "../Middleware/Auth.js"
import uploads from "../Middleware/uploads.js"

const UserRouter = express.Router()

// ── Google OAuth ──────────────────────
UserRouter.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"],prompt: "select_account", session:false })
);

UserRouter.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user, info) => {
    // if not find user & error 
    if (err || !user) {
      console.log("Auth Error:", err);
      return res.redirect(`${process.env.CLIENT_URL}/signin?error=true`);
    }

    req.user = user;
    next();
  })(req, res, next);
}, User.googleCallback);


UserRouter.post("/signup", User.signUp)
UserRouter.post("/signin", User.signIn)
UserRouter.post("/verified", User.verifyEmail)      
UserRouter.get("/get-me", User.getMe)               
UserRouter.post("/refresh-token", User.refreshToken) 
UserRouter.post("/forgot-password", User.forgotPassword);
UserRouter.post("/verify-reset-otp", User.verifyResetOtp);
UserRouter.post("/reset-password", User.resetPassword);


UserRouter.post("/logout", verifyToken, User.logout)
UserRouter.get("/logout-all", verifyToken, User.logOutAll)
UserRouter.get("/profile", verifyToken, User.profile)
UserRouter.put("/updated-avatar",verifyToken,uploads.single("avatar"),User.updatedAvtar)

export default UserRouter;
