import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // initialize new Prisma client instance upon startup
    await this.$connect();
  }

  /** safely exit Prisma before turning off Nest instance */
  async enableShutdownHook(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
