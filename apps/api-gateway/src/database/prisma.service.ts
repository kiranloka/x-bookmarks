// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// Import the type from the official package or your shared package
import { prisma } from '@db/prisma';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Use the runtime `prisma` value's type to avoid cross-package type resolution
  private readonly client: typeof prisma = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  get prisma() {
    return this.client;
  }
}
