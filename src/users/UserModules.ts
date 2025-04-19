import { Module } from '@nestjs/common'
import { UserController } from './UserController'
import { UsersService } from './UserServices'
import { UserEntity } from './UserEntity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
