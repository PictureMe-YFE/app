import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import { userExist, userExistById } from "@/actions/auth.actions";
import bcrypt from "bcryptjs";


export const authOptions = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Se connecter",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "paradice@gmail.com" },
        password: { label: "Password", type: "password", placeholder: "*******" },
      },

      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await userExist(email);
        if (!user) {
          return null;
        }
        const passwordMatch = await bcrypt.compare(credentials.password, user.user.credentials.password);

        if (passwordMatch) {
          return user.user;
        }

      }
    }),
    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    ...(connectMongo
      ? [
        EmailProvider({
          server: {
            host: "smtp.resend.com",
            port: 465,
            auth: {
              user: "resend",
              pass: process.env.RESEND_API_KEY,
            },
          },
          from: config.resend.fromNoReply,
        }),
      ]
      : []),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        console.log("session", session)
        session.user.id = token.sub;
      }
      if (session.user) {
        session.user.username = token.name;
        session.user.email = token.email;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await userExistById(token.sub);

      if (!existingUser) {
        return token;
      }

      token.name = existingUser.username;
      token.email = existingUser.credentials.email;

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`,
  },
};
