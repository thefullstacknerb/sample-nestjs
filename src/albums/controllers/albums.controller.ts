import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Album } from '@prisma/client';
import { ControllerBase } from 'src/shared/interfaces';
import { AlbumDto, CreateAlbumRequestBodyDto, FindManyAlbumsRequestQueryDto } from '../dtos';
import { UpdateAlbumRequestBodyDto } from '../dtos/update-album-request-body.dto';
import { AlbumsProvider } from '../providers/albums.provider';

@Controller({ path: 'albums' })
@ApiTags('Albums')
@ApiExtraModels(AlbumDto)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
@ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
@ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many request' })
export class AlbumsController implements ControllerBase<Album> {
  constructor(private readonly albumService: AlbumsProvider) {}

  @Post()
  @ApiOperation({ summary: 'Create a new album' })
  @ApiExtraModels(CreateAlbumRequestBodyDto)
  @ApiBody({
    schema: { $ref: getSchemaPath(CreateAlbumRequestBodyDto) },
  })
  @ApiCreatedResponse({ schema: { $ref: getSchemaPath(AlbumDto) } })
  @ApiConflictResponse({ description: 'Conflict' })
  async create(@Body() body: CreateAlbumRequestBodyDto, ...args: any[]): Promise<Partial<Album>> {
    return await this.albumService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get multiple albums' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      items: {
        $ref: getSchemaPath(AlbumDto),
      },
    },
  })
  async findMany(@Query() query?: FindManyAlbumsRequestQueryDto): Promise<Partial<AlbumDto>[]> {
    return await this.albumService.findMany(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single album' })
  @ApiResponse({ status: HttpStatus.OK, schema: { $ref: getSchemaPath(AlbumDto) } })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Album not found' })
  async findOne(@Param('id', ParseIntPipe) id: number, query?: any): Promise<Partial<AlbumDto>> {
    return await this.albumService.findOne(id, query);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a album info' })
  @ApiExtraModels(UpdateAlbumRequestBodyDto)
  @ApiResponse({ status: HttpStatus.OK, schema: { $ref: getSchemaPath(AlbumDto) } })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Album not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAlbumRequestBodyDto,
    ...args: any[]
  ): Promise<Partial<Album>> {
    return await this.albumService.update(id, body);
  }
}
