const passport = require('passport');
const User = require('../models/User');

// Strategies are registered lazily so missing credentials don't crash the server.
// They will be set up when this module is first required, after dotenv has loaded.

function setup() {
  const googleId = process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
  const githubId = process.env.GITHUB_CLIENT_ID;
  const githubSecret = process.env.GITHUB_CLIENT_SECRET;
  const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';

  // ── Google ──────────────────────────────────────────────────
  if (googleId && googleSecret && googleId !== 'your_google_client_id') {
    const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
    passport.use(new GoogleStrategy(
      {
        clientID: googleId,
        clientSecret: googleSecret,
        callbackURL: `${serverUrl}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ provider: 'google', providerId: profile.id });
          if (user) {
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              user.provider = 'google';
              user.providerId = profile.id;
              user.avatar = profile.photos?.[0]?.value || null;
              user.lastLogin = new Date();
              await user.save();
              return done(null, user);
            }
          }

          user = new User({
            name: profile.displayName || 'Google User',
            email: email || `google_${profile.id}@oauth.placeholder`,
            provider: 'google',
            providerId: profile.id,
            avatar: profile.photos?.[0]?.value || null,
            lastLogin: new Date(),
          });
          await user.save();
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    ));
    console.log('✅ Google OAuth strategy registered');
  } else {
    console.warn('⚠️  Google OAuth not configured — set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
  }

  // ── GitHub ──────────────────────────────────────────────────
  if (githubId && githubSecret && githubId !== 'your_github_client_id') {
    const { Strategy: GitHubStrategy } = require('passport-github2');
    passport.use(new GitHubStrategy(
      {
        clientID: githubId,
        clientSecret: githubSecret,
        callbackURL: `${serverUrl}/api/auth/github/callback`,
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ provider: 'github', providerId: String(profile.id) });
          if (user) {
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              user.provider = 'github';
              user.providerId = String(profile.id);
              user.avatar = profile.photos?.[0]?.value || null;
              user.lastLogin = new Date();
              await user.save();
              return done(null, user);
            }
          }

          user = new User({
            name: profile.displayName || profile.username || 'GitHub User',
            email: email || `github_${profile.id}@oauth.placeholder`,
            provider: 'github',
            providerId: String(profile.id),
            avatar: profile.photos?.[0]?.value || null,
            lastLogin: new Date(),
          });
          await user.save();
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    ));
    console.log('✅ GitHub OAuth strategy registered');
  } else {
    console.warn('⚠️  GitHub OAuth not configured — set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET');
  }

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

setup();

module.exports = passport;
