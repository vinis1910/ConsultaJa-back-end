import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './AuthControllers'
import { AuthService } from './AuthServices'
import { JwtStrategy } from './JWTStrategyService'
import { LocalStrategy } from './LocalStrategyService'
import ENVIRONMENT from 'src/configs/EnvironmentConfiguration'
import { UsersService } from 'src/users/UserServices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from 'src/users/UserEntity'

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: ENVIRONMENT.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
