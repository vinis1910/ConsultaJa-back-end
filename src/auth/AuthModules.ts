import { Module } from '@nestjs/common';
import { AuthService } from './AuthServices';
import { AuthController } from './AuthControllers';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
