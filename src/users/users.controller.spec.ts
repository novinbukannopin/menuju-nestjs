import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./users.entity";
import { NotFoundException } from "@nestjs/common";

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve(
          { id,
            email: 'salted@solomon.id',
            password: 'salted'
          } as User);
      },

      find: (email: string) => {
        return Promise.resolve(
          [{ id: 1, email, password: 'salted' } as User]);
      },


    }

    fakeAuthService = {
      signIn: (email: string, password: string) => {
        return Promise.resolve(
          { id: 1, email, password } as User);
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("findAllUsers return a list of users with the given email", async () => {
    const user = await controller.findAllUsers('salted@solomon.id')
    expect(user.length).toEqual(1)
    expect(user[0].email).toEqual('salted@solomon.id')
  })

  it("find user return a user with the given id", async () => {
    const user = await controller.findUser('1')
    expect(user.id).toEqual(1)
  })

  it("find user throws an error if user does not exist", async () => {
    fakeUsersService.findOne = ()=> null;
    await expect(controller.findUser('1'))
      .rejects
      .toThrow(NotFoundException)
  })

  it("signUp returns a user with the given email", async () => {
    const session = { userId: -10}
    const user = await controller.signIn({email: "salted@solomon.id", password: "salted"}, session)

    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })
});
