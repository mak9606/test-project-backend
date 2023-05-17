import { Controller, UseGuards, Post, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Routes without authentication

  @Post('signup')
  async signUp(createUserDto: CreateUserDto) {
    // Handle user signup logic
  }

  @Post('login')
  async login(loginUserDto: LoginUserDto) {
    // Handle user login logic
  }

  // Routes requiring authentication

  @UseGuards(AuthGuard())
  @Get('profile')
  async getProfile(request: any) {
    // Handle protected route logic
  }
}
