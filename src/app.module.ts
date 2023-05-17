import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { secretKey } from './secret/secretkey';

@Module({
  imports: [
    JwtModule.register({
      secret: secretKey,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
