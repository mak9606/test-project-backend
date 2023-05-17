import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { bcrypt } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    // Check if the user with the provided email already exists
    const existingUser = await this.userRepository.findOne({ email });
    if (existingUser) {
      throw new NotFoundException('User with this email already exists');
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

  async loginUser(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;

    // Find the user by email
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    // Check if the provided password matches the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid email or password');
    }

    return user;
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
