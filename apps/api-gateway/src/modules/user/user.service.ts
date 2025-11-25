import { Injectable } from '@nestjs/common';

import { Prisma, PrismaClient, User } from '@db/prisma';

@Injectable()
export class UserService {
  constructor(private db: PrismaClient) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({
      ...data,

      lastSyncAt: data.lastSyncAt || Date.now(),
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    return this.db.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.db.user.delete({
      where,
    });
  }

  async user(
    UserWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.db.user.findUnique({
      where: UserWhereUniqueInput,
    });
  }
}
