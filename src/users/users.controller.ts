import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseInterceptors } from "@nestjs/common";
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Serialize, SerializeInterceptor } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "./users.entity";

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User){
    return user;
  }

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any){
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any){
    return session.color;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any){
    session.userId = null;
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id))
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUsers(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUsers(@Param('id') id: string, @Body() body: UpdateUserDto){
    return this.userService.update(parseInt(id), body);
  }
}
