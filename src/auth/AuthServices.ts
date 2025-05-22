import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { UsersService } from 'src/users/UserServices'
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, userPassword: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException('Credenciais inválidas')

    const match = await bcrypt.compare(userPassword, user.password)
    if (!match) throw new UnauthorizedException('Credenciais inválidas')

    const { password, ...result } = user
    return result
  }

  async login(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    const access_token = this.jwtService.sign(payload)
    return { access_token, role: user.role }
  }
}
