import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const GOOGLE_AUTHORIZATION_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    prompt: 'select_account',
    // access_type: 'online',
    // response_type: 'code',
  });

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        // console.log('this is prof', profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      authorization: GOOGLE_AUTHORIZATION_URL,
    }),
  ],
  // secret: process.env.NEXT_PUBLIC_SECRET,
  debug: true,
};

export default NextAuth(authOptions);
