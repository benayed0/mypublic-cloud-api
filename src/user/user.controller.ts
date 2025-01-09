import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('login')
  login(@Request() req) {
    const { email } = req.user as User;
    return this.userService.login(email);
  }
}
