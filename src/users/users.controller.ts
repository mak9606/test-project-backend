import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Param,
  Query,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // Routes without authentication

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }

  // Routes requiring authentication

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Query() id: { id: number }) {
    return this.userService.findUserById(id);
  }
}
