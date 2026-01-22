import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;

      let user = await User.findOne({ email });

      // User exists → but username may be missing
      if (user) {
        return done(null, user);
      }

      // TEMP user (no username yet)
      user = await User.create({
        email,
        googleId: profile.id,
        username: null, // force username step
      });

      done(null, user);
    }
  )
);

export default passport;
