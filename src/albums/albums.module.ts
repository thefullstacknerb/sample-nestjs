import { Module } from '@nestjs/common';
import { AlbumsController } from './controllers';
import { AlbumsProvider } from './providers';

@Module({
  providers: [AlbumsProvider],
  controllers: [AlbumsController],
  exports: [AlbumsProvider],
})
export class AlbumsModule {}
