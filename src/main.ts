import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma';

async function bootstrap() {
  // workaround in case stringifying Bigint to json
  (BigInt.prototype as any).toJSON = () => {
    return Number(this);
  };

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Sample Music App - The Full Stack Nerb')
    .setDescription('Sample Music App API References')
    .setContact('Author: Khuong Do', 'https://www.thefullstacknerb.com', 'dohuukhuong@gmail.com')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHook(app);

  await app.listen(3000);
}
bootstrap();
