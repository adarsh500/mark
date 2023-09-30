import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },

    async jwt({ token, user, account, profile }) {
      if (account && profile) {
        token.id = profile.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
