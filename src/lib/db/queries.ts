import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import prisma from '@/lib/db/prisma';
import { AuthError } from '@/lib/Exceptions/auth.exceptions';
import { hashPassword } from '@/lib/server.utils';
import { AppAuthorize, AppUser } from '@/lib/types';

import { CreateVmResult } from '@/Services/server/azureService/azure.types';

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
      },
    });

    const user: AppUser = {
      id: newUser.userId,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
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

export async function findUserByEmailAllData(email: string) {
  return prisma?.user.findUnique({ where: { email } });
}
