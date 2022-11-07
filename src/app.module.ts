import { CacheInterceptor, CacheModule, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AlbumsModule } from './albums/albums.module';
import environmentConfig from './config/environment.config';
import { PrismaModule } from './prisma';

@Module({
  imports: [
    AlbumsModule,
    PrismaModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [environmentConfig],
    }),
    // maximum 6 api calls per minute
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // config key is the key of `environmentConfig`
      useFactory: (config: ConfigService) => config.get('throttler'),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // config key is the key of `environmentConfig`
      useFactory: (config: ConfigService) => config.get('cache'),
    }),
  ],
  providers: [
    // global cache interceptor that forces every single request to validate against cache first
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    // global validation pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // throw 400 error upon first validation failure
        stopAtFirstError: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,

        // we should disable implicit conversion here since it may lead to undesired transform behavior.
        // Instead we should define the transformation logic right at the properties 
        // using @Transform() or @Type() decorators
        transformOptions: {
          enableImplicitConversion: false
        }
      }),
    },
    // global throller guard that protects all endpoints
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
