import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';

export const secretKey =
  process.env.JWT_SECRET_KEY || 'MY_SECRET_KEY_123456789';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'db',
      entities: [User],
      synchronize: true,
    }),

    JwtModule.register({
      secret: secretKey,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    PassportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
