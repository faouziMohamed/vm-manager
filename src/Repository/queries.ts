import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { AuthError } from '@/lib/Exceptions/auth.exceptions';
import { hashPassword } from '@/lib/server.utils';
import { AppAuthorize, AppUser, VerificationTokenKind } from '@/lib/types';

import prisma from '@/Repository/prisma';
import { CreateVmResult } from '@/Services/server/azureService/azure.types';

const VERIFICATION_TOKEN_KINDS: VerificationTokenKind[] = ['email', 'password'];
export async function createVerificationToken(
  userId: string,
  token: string,
  kind = 'email',
) {
  return prisma!.verificationToken.create({
    data: {
      token,
      userId,
      kind,
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    },
  });
}

export async function createNewUser(credentials: AppAuthorize) {
  if (!credentials.firstname || !credentials.lastname) {
    throw new AuthError('First and last name are required');
  }
  try {
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
        avatar: true,
      },
    });

    const user: AppUser = {
      id: newUser.userId,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      avatar: newUser.avatar,
    };
    return user;
  } catch (error) {
    const e = error as PrismaClientKnownRequestError;
    if (e.code === 'P2002') {
      throw new AuthError('Email already exists');
    } else {
      throw new AuthError('An error occurred while creating a new user');
    }
  }
}

export async function removeUnverifiedUsers(thresholdDate: Date) {
  const usersToDelete = await prisma!.user.findMany({
    where: {
      emailVerified: null,
      createdAt: { lt: thresholdDate },
      updatedAt: { lt: thresholdDate },
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
    where: { expires: { lte: now } },
  });
  return count;
}

export async function saveNewVirtualMachine(
  userId: string,
  instance: CreateVmResult,
  serverName: string,
) {
  await prisma!.vmInstances.create({
    data: {
      userId,
      instanceId: instance.instanceId,
      serverName,
      computerName: instance.computerName,
      publicIpName: instance.publicIpName,
      resourceGroupName: instance.resourceGroupName,
      region: instance.region,
      isFavorite: false,
    },
  });
}

export async function getUserSavedVirtualMachines(userId: string) {
  return prisma!.vmInstances.findMany({
    where: { userId },
    select: {
      instanceId: true,
      serverName: true,
      computerName: true,
      publicIpName: true,
      resourceGroupName: true,
    },
  });
}

export async function getOneUserSavedVirtualMachine(
  userId: string,
  instanceId: string,
) {
  return prisma!.vmInstances.findFirst({
    where: { userId, instanceId },
    select: {
      instanceId: true,
      serverName: true,
      computerName: true,
      publicIpName: true,
      resourceGroupName: true,
      isFavorite: true,
    },
  });
}

export async function updateVmInstanceFavoriteStatus(
  instanceId: string,
  isFavorite: boolean,
) {
  return prisma!.vmInstances.update({
    where: { instanceId },
    data: { isFavorite },
  });
}

export async function existsVm(instanceId: string) {
  const instance = await prisma!.vmInstances.findFirst({
    where: { instanceId },
  });
  return !!instance;
}

export async function deleteVirtualMachine(instanceId: string) {
  await prisma!.vmInstances.delete({ where: { instanceId } });
}

export async function getUserByEmailAllData(email: string) {
  return prisma?.user.findUnique({ where: { email } });
}

export async function getUserByEmail(email: string) {
  return prisma!.user.findUnique({
    where: { email },
    select: {
      userId: true,
      firstname: true,
      lastname: true,
      avatar: true,
      email: true,
    },
  });
}
export function getUserByUserId(userId: string) {
  return prisma!.user.findUnique({
    where: { userId },
    select: {
      userId: true,
      emailVerified: true,
      firstname: true,
      lastname: true,
      avatar: true,
    },
  });
}

export async function setUserEmailVerified(userId: string) {
  const now = new Date();
  await prisma!.user.update({
    where: { userId },
    data: { emailVerified: now },
    select: {
      userId: true,
      email: true,
      firstname: true,
      lastname: true,
      avatar: true,
    },
  });
}

export async function existsUser(userId: string) {
  const user = await prisma!.user.findUnique({
    where: { userId },
    select: { userId: true },
  });
  return !!user;
}

export async function deleteToken(token: string) {
  await prisma!.verificationToken.delete({
    where: { token },
  });
}

export function findTokenFromDb(token: string) {
  return prisma!.verificationToken.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          userId: true,
          email: true,
          firstname: true,
          lastname: true,
          avatar: true,
        },
      },
    },
  });
}

export async function updateUserEmail(userId: string, email: string) {
  return prisma!.user.update({
    where: { userId },
    data: { email },
  });
}
export async function updateUserAvatar(userId: string, avatarUrl: string) {
  await prisma!.user.update({
    where: { userId },
    data: { avatar: avatarUrl },
  });
}

export async function deleteVerificationTokenOfKind(
  userId: string,
  kind: VerificationTokenKind = 'email',
) {
  if (!VERIFICATION_TOKEN_KINDS.includes(kind)) {
    const msg =
      `Invalid token kind. The token kind must be one of: ` +
      `${VERIFICATION_TOKEN_KINDS.join(', ')} `;
    throw new Error(msg);
  }
  return prisma!.verificationToken.deleteMany({
    where: { userId, kind },
  });
}

export async function isVerificationTokenValid(
  userId: string,
  token: string,
  kind: VerificationTokenKind = 'email',
) {
  if (!VERIFICATION_TOKEN_KINDS.includes(kind)) {
    const msg =
      `Invalid token kind. The token kind must be one of: ` +
      `${VERIFICATION_TOKEN_KINDS.join(', ')} `;
    throw new Error(msg);
  }
  const now = new Date();

  const verificationToken = await prisma!.verificationToken.findUnique({
    where: { userId_token_kind: { userId, token, kind } },
    select: { expires: true },
  });
  if (!verificationToken) {
    return false;
  }
  return verificationToken.expires > now;
}

export async function updateUserPassword(userId: string, password: string) {
  return prisma!.user.update({
    where: { userId },
    data: { password: await hashPassword(password) },
  });
}
