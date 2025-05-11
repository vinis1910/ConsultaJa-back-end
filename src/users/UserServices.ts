import { BadRequestException, Injectable } from '@nestjs/common'
import { UserEntity } from './UserEntity'
import { Repository } from 'typeorm'
import { CreateUserDTO } from './dto/CreateUserDTO'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor() {}

  async createUser(createUserDTO: CreateUserDTO, userRepository: Repository<UserEntity>): Promise<UserEntity> {
    if (!createUserDTO.email) throw new BadRequestException('Email is a required field.')
    if (!createUserDTO.password) throw new BadRequestException('Password is a required field.')
    if (!createUserDTO.role) throw new BadRequestException('Role is a required field.')

    const user = await userRepository.findOneBy({ email: createUserDTO.email })
    if (user) throw new BadRequestException(`Usuário ja cadastrado com email=${createUserDTO.email}.`)

    const encryptedPassword = await this.encryptPassword(createUserDTO.password)
    const createdUser = await userRepository.save({ email: createUserDTO.email, password: encryptedPassword, role: createUserDTO.role, createdAt: new Date() })

    return createdUser
  }

  private async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }
}
