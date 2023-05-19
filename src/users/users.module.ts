import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';

export const secretKey =
  process.env.JWT_SECRET_KEY || 'MY_SECRET_KEY_123456789';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: secretKey,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
  ],

  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
