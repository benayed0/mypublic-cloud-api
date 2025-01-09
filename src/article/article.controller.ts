import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { UserService } from 'src/user/user.service';
import { filename } from './entities/article.entity';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private userService: UserService,
  ) {}
  @UseGuards(JwtGuard)
  @Post('get_files_upload_url')
  async getFilesUploadUrl(
    @Body() body: CreateArticleDto,
    @Request() req: { user: { email: string } },
  ) {
    const { _id } = await this.userService.findOne(req.user.email);
    return await this.articleService.getFilesUploadUrl(_id, body);
  }
  @UseGuards(JwtGuard)
  @Get('get_by_user')
  async getArticlesByUser(@Request() req: { user: { email: string } }) {
    const { _id } = await this.userService.findOne(req.user.email);
    return await this.articleService.findAllByUser(_id);
  }

  @Get('get_file/:id/:filename')
  async getFile(
    @Param('id') id: string,
    @Param('filename') filename: filename,
  ) {
    return await this.articleService.getFileDownloadUrl(id, filename);
  }
}
