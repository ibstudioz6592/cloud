import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "../../../libs/mongodb";
import User from "../../../models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error("No user found with this email");
        }
        
        if (!user.password) {
          throw new Error("Please sign in with Google");
        }
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error("Invalid password");
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();
      
      if (account.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Create new user for Google OAuth
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            lastLogin: new Date(),
          });
        } else {
          // Update last login
          existingUser.lastLogin = new Date();
          if (existingUser.provider !== "google") {
            existingUser.provider = "google";
          }
          if (!existingUser.image && user.image) {
            existingUser.image = user.image;
          }
          await existingUser.save();
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
