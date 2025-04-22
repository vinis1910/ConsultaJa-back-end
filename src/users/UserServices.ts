import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './UserEntity'
import { Repository } from 'typeorm'
import { CreateUserDTO } from './dto/CreateUserDTO'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    if (!createUserDTO.email) throw new BadRequestException('Email is a required field.')
    if (!createUserDTO.password) throw new BadRequestException('Password is a required field.')
    if (!createUserDTO.role) throw new BadRequestException('Role is a required field.')

    const user = await this.userRepository.findOneBy({ email: createUserDTO.email })
    if (user) throw new BadRequestException(`An user already registered with email=${createUserDTO.email}.`)

    const encryptedPassword = await this.encryptPassword(createUserDTO.password)
    const createdUser = await this.userRepository.save({ email: createUserDTO.email, password: encryptedPassword, role: createUserDTO.role })

    return createdUser
  }

  private async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }
}
