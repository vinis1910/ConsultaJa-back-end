import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Post } from '@nestjs/common'
import { UsersService } from './UserServices'
import { CreateUserDTO } from './dto/CreateUserDTO'
import { ResponseDTO } from 'src/utils/ReponseDTO'
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO): Promise<ResponseDTO> {
    try {
      const user = await this.userService.createUser(createUserDTO)
      return new ResponseDTO(HttpStatus.CREATED, 'User created')
    } catch (error) {
      if (error instanceof HttpException) throw error
      else throw new InternalServerErrorException(error.message, 'Unexpected error')
    }
  }
}
