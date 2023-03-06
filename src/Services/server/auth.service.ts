/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { User } from '@prisma/client';
import { JWT } from 'next-auth/jwt';

import {
  createNewUser,
  findUserByEmailAllData,
  removeExpiredVerificationTokens,
  removeUnverifiedUsers,
} from '@/lib/db/queries';
import { AuthError } from '@/lib/Exceptions/auth.exceptions';
import { verifyPassword } from '@/lib/server.utils';
import {
  AppAuthorize,
  AppUserWithEmailVerification,
  PayloadToken,
} from '@/lib/types';

import {
  sendAccountDeletedEmail,
  sendVerificationEmail,
} from '@/Services/server/mail.service';

export async function addNewUser(credentials: AppAuthorize) {
  const user = await createNewUser(credentials);
  // eslint-disable-next-line no-console
  console.log(user);
  await sendVerificationEmail(user);
  return user;
}

export async function trySignInUser(
  maybeUser: User,
  credentials: AppAuthorize,
) {
  const arePasswordMatching = await verifyPassword(
    credentials.password,
    maybeUser.password,
  );
  if (!arePasswordMatching) {
    throw new AuthError('Email or password is incorrect, verify and try again');
  }
  const user: AppUserWithEmailVerification = {
    id: maybeUser.userId,
    firstname: maybeUser.firstname,
    lastname: maybeUser.lastname,
    email: maybeUser.email,
    emailVerified: maybeUser.emailVerified,
    avatar: maybeUser.avatar,
  };
  return user;
}

export async function deleteUnverifiedUsers() {
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
  const deletedUserEmails = await removeUnverifiedUsers(fourHoursAgo);
  // eslint-disable-next-line no-console
  console.log(
    `Deleted ${deletedUserEmails.length} expired verification tokens and unverified users`,
  );

  const sendEmails = deletedUserEmails.map((email) =>
    sendAccountDeletedEmail(email),
  );
  await Promise.all(sendEmails);
  // eslint-disable-next-line no-console
  console.log(`Sent ${sendEmails.length} emails`);
  return deletedUserEmails;
}

export async function deleteExpiredVerificationTokens() {
  const count = await removeExpiredVerificationTokens();
  // eslint-disable-next-line no-console
  console.log(
    `Deleted ${count} expired verification tokens and unverified users`,
  );
}

export async function authorize<C>(
  credentials: Record<keyof C, string> | undefined,
) {
  const cred = credentials as AppAuthorize;
  if (!cred || !cred.email || !cred.password) {
    throw new AuthError('Email and password are required');
  }
  if (cred.action !== 'register' && cred.action !== 'signin') {
    throw new AuthError(
      'Invalid action, the correct values are "register" or "signin"',
    );
  }
  const maybeUser = await findUserByEmailAllData(cred.email);
  if (cred.action === 'register') {
    if (maybeUser) {
      throw new AuthError([
        'The Email address is already taken',
        'Use another one or sign in',
      ]);
    }
    return addNewUser(cred);
  }
  if (cred.action === 'signin') {
    if (!maybeUser) {
      throw new AuthError(['User not found', 'Please register first']);
    }
    return trySignInUser(maybeUser, cred);
  }
  return null;
}

export function createPayloadWithNewlySignedUser(
  appUser: AppUserWithEmailVerification,
  token: JWT,
) {
  const isEmailVerified = !!appUser.emailVerified;
  const tk: PayloadToken = {
    ...token,
    user: {
      id: appUser.id,
      emailVerified: isEmailVerified,
      avatar: appUser.avatar || `/images/avatars/default-avatar.png`,
    },
  };

  if (appUser.emailVerified) {
    tk.user.firstname = appUser.firstname;
    tk.user.lastname = appUser.lastname;
    tk.user.email = appUser.email;
  }
  return tk;
}
