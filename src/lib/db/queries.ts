import prisma from '@/lib/db/prisma';
import { hashPassword } from '@/lib/server/server-utils';
import { AppAuthorize, AppUser } from '@/lib/types';
import { AuthError } from '@/lib/utils';

export async function createVerificationToken(userId: string, token: string) {
  return prisma!.verificationToken.create({
    data: {
      token,
      userId,
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    },
  });
}

export async function createNewUser(credentials: AppAuthorize) {
  if (!credentials.firstname || !credentials.lastname) {
    throw new AuthError('First and last name are required');
  }
  const newUser = await prisma!.user.create({
    data: {
      email: credentials.email,
      password: await hashPassword(credentials.password),
      firstname: credentials.firstname,
      lastname: credentials.lastname,
    },
    select: {
      userId: true,
      firstname: true,
      lastname: true,
      email: true,
    },
  });

  const user: AppUser = {
    id: newUser.userId,
    firstname: newUser.firstname,
    lastname: newUser.lastname,
    email: newUser.email,
  };
  return user;
}

export async function removeUnverifiedUsers(thresholdDate: Date) {
  const usersToDelete = await prisma!.user.findMany({
    where: {
      emailVerified: null,
      createdAt: { lt: thresholdDate },
    },
    select: { email: true },
  });
  const deletedUserEmails = usersToDelete.map((u) => u.email);
  await prisma!.user.deleteMany({
    where: { email: { in: deletedUserEmails } },
  });
  return deletedUserEmails;
}

export async function removeExpiredVerificationTokens() {
  const now = new Date();
  const { count } = await prisma!.verificationToken.deleteMany({
    where: {
      expires: { lte: now },
    },
  });
  return count;
}
