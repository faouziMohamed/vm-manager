import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from '@/lib/db/prisma';
import {
  AppAuthorize,
  AppUser,
  AppUserWithEmailVerification,
} from '@/lib/types';
import { AuthError } from '@/lib/utils';

import { addNewUser, trySignInUser } from '@/Services/server/auth.service';

type PayloadToken = Partial<JWT> & {
  user: Partial<Omit<AppUserWithEmailVerification, 'emailVerified' | 'id'>> & {
    emailVerified?: boolean;
    id: string;
  };
};

export const nextAuthOptions: AuthOptions = {
  // Configure one or more authentication providers
  session: { strategy: 'jwt' },
  pages: {
    newUser: '/new-user',
    verifyRequest: '/verify-email',
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
        firstname: { type: 'text' },
        lastname: { type: 'text' },
        action: { type: 'text' },
      },
      name: 'Credentials',
      authorize,
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/require-await
    async session({ session, token }) {
      const tk: PayloadToken = token as PayloadToken; // data from jwt callback when user is signed in, see below
      const id = Math.floor(Math.random() * 1000000);
      session.user = {
        ...session.user,
        ...tk.user,
        avatar: `https://avatars.githubusercontent.com/u/${id}?v=4`,
      } as AppUser;
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async jwt({ token, user }) {
      // const appUser = user as AppUser;
      const appUser = user as AppUserWithEmailVerification;

      if (user) {
        const tk: PayloadToken = {
          ...token,
          user: {
            id: appUser.id,
            emailVerified: true, // TODO: use this snippet when email verification is implemented !!appUser.emailVerified,*
            avatar: 'https://avatars.githubusercontent.com/u/649761?v=4',
          },
        };
        // TODO: add this if back in when email verification is implemented
        // if (appUser.emailVerified) {
        tk.user.firstname = appUser.firstname;
        tk.user.lastname = appUser.lastname;
        tk.user.email = appUser.email;
        // }
        return tk;
      }
      return token;
    },
  },
};
export default NextAuth(nextAuthOptions);

async function authorize<C>(credentials: Record<keyof C, string> | undefined) {
  const cred = credentials as AppAuthorize;
  if (!cred || !cred.email || !cred.password) {
    throw new AuthError('Email and password are required');
  }
  if (cred.action !== 'register' && cred.action !== 'signin') {
    throw new AuthError(
      'Invalid action, the correct values are "register" or "signin"',
    );
  }
  const maybeUser = await prisma?.user.findUnique({
    where: { email: cred.email },
  });
  if (cred.action === 'register') {
    if (maybeUser) {
      throw new AuthError(['Email already exists', 'Try signing in']);
    }
    return addNewUser(cred);
  }
  if (cred.action === 'signin') {
    if (!maybeUser) {
      throw new AuthError(['Email does not exist', 'Try registering']);
    }
    return trySignInUser(maybeUser, cred);
  }
  return null;
}
