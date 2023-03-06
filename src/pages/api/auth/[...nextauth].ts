import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { LOGIN_PAGE, VERIFICATION_LINK_SENT_PAGE } from '@/lib/client-route';
import prisma from '@/lib/db/prisma';
import {
  AppUser,
  AppUserWithEmailVerification,
  PayloadToken,
} from '@/lib/types';

import {
  authorize,
  createPayloadWithNewlySignedUser,
} from '@/Services/server/auth.service';

function getUserByUserId(userId: string) {
  return prisma!.user.findUnique({
    where: { userId },
    select: {
      emailVerified: true,
      firstname: true,
      lastname: true,
      image: true,
    },
  });
}

async function updatePayloadWithDataFromDb(connectedUser: AppUser, token: JWT) {
  const userFromDb = await getUserByUserId(connectedUser.id);
  if (!userFromDb || !userFromDb.emailVerified) {
    return token;
  }
  const tk = token as PayloadToken;
  tk.user = tk.user || { id: connectedUser.id };
  tk.user.emailVerified = true;
  tk.user.firstname = userFromDb.firstname;
  tk.user.lastname = userFromDb.lastname;
  tk.user.avatar = userFromDb.image!; // mqy be null though but not undefined
  return tk;
}

export const nextAuthOptions: AuthOptions = {
  // Configure one or more authentication providers
  session: { strategy: 'jwt' },
  pages: {
    newUser: '/new-user',
    verifyRequest: VERIFICATION_LINK_SENT_PAGE,
    signIn: LOGIN_PAGE,
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

      session.user = {
        ...session.user,
        ...tk.user,
        avatar: tk.user.avatar,
      } as AppUser;
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async jwt({ token, user }) {
      // const appUser = user as AppUser;
      // user is defined when user just signed in
      if (user) {
        const appUser = user as AppUserWithEmailVerification;
        return createPayloadWithNewlySignedUser(appUser, token);
      }

      // the user is already signed in, so we just return the token
      // we also update the token if the user has just verified his email
      const connectedUser = token.user as AppUser;
      if (!connectedUser.emailVerified) {
        return updatePayloadWithDataFromDb(connectedUser, token);
      }
      return token;
    },
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return NextAuth(req, res, nextAuthOptions);
};

export default handler;
// export default NextAuth(nextAuthOptions);
