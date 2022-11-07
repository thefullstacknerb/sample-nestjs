import { ConflictException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Album } from '@prisma/client';
import { PrismaService } from 'src/prisma';
import { ProviderBase } from 'src/shared/interfaces';
import { CreateAlbumRequestBodyDto, FindManyAlbumsRequestQueryDto } from '../dtos';
import { UpdateAlbumRequestBodyDto } from '../dtos/update-album-request-body.dto';

@Injectable({ scope: Scope.TRANSIENT })
export class AlbumsProvider implements ProviderBase<Album> {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateAlbumRequestBodyDto, ...args: any[]): Promise<Partial<Album>> {
    const album = await this.prisma.album.findFirst({
      where: {
        ...body,
      },
    });

    if (album) {
      throw new ConflictException();
    }

    return await this.prisma.album.create({
      data: {
        ...body,
      },
    });
  }

  async findMany(query?: FindManyAlbumsRequestQueryDto): Promise<Partial<Album>[]> {
    return await this.prisma.album.findMany({
      where: {
        ArtistId: query?.artistId,
      },
      skip: query?.offset,
      take: query?.limit,
    });
  }

  async findOne(id: number, query?: any): Promise<Partial<Album>> {
    const album = await this.prisma.album.findFirst({ where: { AlbumId: id } });

    // album = null means album with the given id doesn't exist
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async update(
    id: number,
    body?: UpdateAlbumRequestBodyDto,
    ...args: any[]
  ): Promise<Partial<Album>> {
    const album = await this.prisma.album.findUnique({ where: { AlbumId: id } });
    if (!album) {
      throw new NotFoundException("The given album id doesn't exist");
    }

    // verify the artist existence
    if (body?.ArtistId) {
      const artist = await this.prisma.artist.findUnique({ where: { ArtistId: body?.ArtistId } });
      if (!artist) {
        throw new NotFoundException("The given artist id doesn't exist");
      }
    }

    return await this.prisma.album.update({
      where: { AlbumId: id },
      data: {
        ...body,
      },
    });
  }
}
