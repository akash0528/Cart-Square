import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Model/User.js"; 


passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. first find 
        let user = await User.findOne({ googleId: profile.id });

        if (user) return done(null, user);

        // 2. check email 
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          //If Existing user then add on googleId
          user.googleId = profile.id;
          user.avatar   = profile.photos[0].value;
          user.verified = true; // If Google verified then directly true
          await user.save();
          return done(null, user);
        }

        // 3.  create New User
        user = await User.create({
          googleId: profile.id,
          userName: profile.displayName,
          email:    profile.emails[0].value, 
          avatar:   profile.photos[0].value,
          verified: true, 
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;