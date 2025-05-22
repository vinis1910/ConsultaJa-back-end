import { Controller, Post, UseGuards, Req, HttpException, InternalServerErrorException, HttpStatus, Body, ValidationPipe } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './AuthServices'
import { LocalAuthGuard } from './guards/LocalAuthGuard'
import { ResponseDTO } from 'src/utils/ReponseDTO'
import { LoginDto } from './dto/LoginDTO'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body(new ValidationPipe({ whitelist: true })) loginDto: LoginDto, @Req() req: Request & { user: any }) {
    try {
      const userAuth = await this.authService.login(req.user)
      return new ResponseDTO(HttpStatus.OK, 'Usuário autenticado com sucesso.', userAuth)
    } catch (error) {
      if (error instanceof HttpException) throw error
      else throw new InternalServerErrorException(error.message, 'Unexpected error')
    }
  }
}
