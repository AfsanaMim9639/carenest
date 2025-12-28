// lib/auth.js

import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google"; // Temporarily disabled
import connectDB from "./db/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    // Email/Password Authentication
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectDB();
          
          // Find user by email
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          }).select('+password');
          
          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if account is active
          if (!user.isActive) {
            throw new Error("Your account has been deactivated");
          }

          // For Google users trying to login with password
          if (user.provider === 'google' && !user.password) {
            throw new Error("Please sign in with Google");
          }

          // Verify password
          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Return user object (password excluded by toJSON method)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
            phone: user.phone,
            emailVerified: user.emailVerified
          };
          
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    }),

    // Google OAuth - Temporarily Disabled
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   authorization: {
    //     params: {
    //       prompt: "consent",
    //       access_type: "offline",
    //       response_type: "code"
    //     }
    //   }
    // }),
  ],

  // Use JWT for session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  // Callbacks
  callbacks: {
    // JWT Callback - runs when token is created/updated
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }

      // Google sign in - save/update user
      if (account?.provider === "google") {
        try {
          await connectDB();
          
          let dbUser = await User.findOne({ email: token.email });
          
          if (dbUser) {
            // Update existing user
            dbUser.name = token.name || dbUser.name;
            dbUser.image = token.picture || dbUser.image;
            dbUser.emailVerified = true;
            
            // If user signed up with credentials, link Google account
            if (dbUser.provider === 'credentials') {
              dbUser.providerId = account.providerAccountId;
            }
            
            await dbUser.save();
          } else {
            // Create new user from Google
            dbUser = await User.create({
              name: token.name,
              email: token.email,
              image: token.picture,
              provider: 'google',
              providerId: account.providerAccountId,
              emailVerified: true,
              isActive: true
            });
          }
          
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.emailVerified = true;
          
        } catch (error) {
          console.error("Error in Google sign in:", error);
        }
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.image = session.image || token.image;
      }

      return token;
    },

    // Session Callback
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },

    // Sign In Callback
    async signIn({ user, account, profile }) {
      try {
        await connectDB();
        
        const dbUser = await User.findOne({ email: user.email });
        
        if (dbUser && !dbUser.isActive) {
          return false;
        }
        
        return true;
      } catch (error) {
        console.error("Sign in callback error:", error);
        return false;
      }
    },
  },

  // Events
  events: {
    async signIn({ user, account }) {
      console.log(`User ${user.email} signed in with ${account.provider}`);
    },
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};