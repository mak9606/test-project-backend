import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CustomException } from '../customExceptionHandling/CustomException';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    // Check if the user with the provided email already exists
    const existingUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new CustomException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;

    // Find the user by email
    const user = await this.userRepository.findOneBy({
      email,
    });
    if (!user) {
      throw new CustomException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = { name: user.name, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };
  }
  async findUserById(id: { id: number }): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id.id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
