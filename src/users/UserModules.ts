import { Module } from '@nestjs/common';
import { UsersController } from './UserControllers';
import { UsersService } from './UserServices';
import { UserEntity } from './UserEntity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
