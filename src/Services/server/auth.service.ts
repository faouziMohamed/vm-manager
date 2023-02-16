/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { User } from '@prisma/client';

import {
  createNewUser,
  removeExpiredVerificationTokens,
  removeUnverifiedUsers,
} from '@/lib/db/queries';
import { verifyPassword } from '@/lib/server/server-utils';
import { AppAuthorize, AppUserWithEmailVerification } from '@/lib/types';
import { AuthError } from '@/lib/utils';

import {
  sendAccountDeletedEmail,
  sendVerificationEmail,
} from '@/Services/server/mail.service';

export async function addNewUser(credentials: AppAuthorize) {
  const user = await createNewUser(credentials);
  await sendVerificationEmail(user);
  return user;
}

export async function trySignInUser(
  maybeUser: User,
  credentials: AppAuthorize,
) {
  const doesPasswordMatches = await verifyPassword(
    credentials.password,
    maybeUser.password,
  );
  if (!doesPasswordMatches) {
    throw new AuthError('Invalid password');
  }
  const user: AppUserWithEmailVerification = {
    id: maybeUser.userId,
    firstname: maybeUser.firstname,
    lastname: maybeUser.lastname,
    email: maybeUser.email,
    emailVerified: maybeUser.emailVerified,
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
