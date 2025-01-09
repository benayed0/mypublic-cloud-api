import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private User: Model<User>) {}
  async login(email: string) {
    const user = await this.findOne(email);
    if (user) {
      return { success: true, message: 'user-found' };
    } else {
      await this.create(email);
      return { success: true, message: 'user-created' };
    }
  }
  async create(email: string) {
    await this.User.create({ email });
  }

  async findOne(email: string) {
    return await this.User.findOne({ email });
  }
}
