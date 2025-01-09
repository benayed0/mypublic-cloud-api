import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { randomUUID } from 'crypto';
import { Article } from './schemas/article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { aws_s3_utils } from './aws_s3_utils';
import { filename } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private Article: Model<Article>) {}

  async getFilesUploadUrl(author_id: Types.ObjectId, files: CreateArticleDto) {
    const article_id = await this.generateUniqueId();

    const reportUrl = await aws_s3_utils.get_upload_url(
      article_id,
      files.report.name,
    );
    const scientificdocUrl = await aws_s3_utils.get_upload_url(
      article_id,
      files.scientific_doc.name,
    );
    const Article = await this.Article.create({
      author_id,
      article_id,
      report_name: files.report.name,
      scientificDoc_name: files.scientific_doc.name,
    });
    const createdAt = Article._id.getTimestamp();
    return { reportUrl, scientificdocUrl, article_id, createdAt };
  }
  async getFileDownloadUrl(article_id: string, filename: filename) {
    const article = await this.Article.findOne({ article_id });
    if (!article) {
      throw new Error('Article not found');
    }
    let fileExactName = '';
    if (filename === 'report') {
      fileExactName = article.report_name;
    } else if (filename === 'scientific_doc') {
      fileExactName = article.scientificDoc_name;
    } else if (filename === 'article') {
      fileExactName = article.article_name;
    } else {
      throw new Error('Invalid filename');
    }
    const url = await aws_s3_utils.get_download_url(article_id, fileExactName);
    return { url };
  }
  async generateUniqueId() {
    const video_ids = (await this.findAll()).map(
      (article) => article.article_id,
    );
    let uniqueId = randomUUID();
    while (video_ids.includes(uniqueId)) {
      uniqueId = randomUUID();
    }
    return uniqueId;
  }
  async findAll() {
    const articles = await this.Article.find();
    return articles.map((article) => ({
      ...article.toObject(),
      createdAt: article._id.getTimestamp(),
    }));
  }
  async findAllByUser(author_id: Types.ObjectId) {
    const articles = await this.Article.find({ author_id });
    return articles.map((article) => ({
      ...article.toObject(),
      createdAt: article._id.getTimestamp(),
    }));
  }
  async updateArticle(article_id: string, updateArticleDto: UpdateArticleDto) {
    try {
      await this.Article.findOneAndUpdate({ article_id }, updateArticleDto);
      return { success: true, message: 'Article updated successfully' };
    } catch (error) {
      return { success: false, message: error };
    }
  }
}
