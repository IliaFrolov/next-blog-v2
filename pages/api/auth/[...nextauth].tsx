import dbConnect from "@lib/dbConnect";
import User from "@models/User";
import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubAuthProvider from "next-auth/providers/github";
import { UserProfile } from "utils/types";

const authOptions: NextAuthOptions = {
  providers: [
    GitHubAuthProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      async profile(profile) {
        const { id, email, name, login, avatar_url } = profile;
        const userProfile = {
          email,
          name: name || login,
          avatar: avatar_url,
          role: "user",
        };
        try {
          await dbConnect();
          const oldUser = await User.findOne({ email });

          if (!oldUser) {
            const user = new User({
              ...userProfile,
              provider: "github",
            });
            await user.save();
          } else {
            userProfile.role = oldUser.role;
          }
        } catch (error) {
          console.error(error);
        }
        return {
          id,
          ...userProfile,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session }) {
      await dbConnect();
      const user = await User.findOne({ email: session.user?.email });
      if (user)
        session.user = {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        } as UserProfile;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/404",
  },
};

export default NextAuth(authOptions);
