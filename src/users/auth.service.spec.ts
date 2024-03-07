import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("AuthService", () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService  = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);

      },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers:[AuthService, {
        provide: UsersService,
        useValue: fakeUsersService
      }]
    }).compile();

    service = module.get<AuthService>(AuthService);
  })

  it("should can create an instance for auth service", async () => {
    expect(service).toBeDefined();
  });

  it("should can register an user with email and salted password", async () => {
    const user = await service.signUp("salted@solomon.id", "salted")
    expect(user.password).not.toEqual("salted")

    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it("throws an error if user signs up with email that is in use", async () => {
    await service.signUp("salted@solomon.id", "salted")
    await expect(service.signUp("salted@solomon.id", "b"))
      .rejects
      .toThrow(BadRequestException)
  })

  it("throws an error if signing in with an email that does not exist", async () => {
    await expect(service.signIn("saltednew@solomon.id", "salted"))
      .rejects
      .toThrow(NotFoundException)
  })

  it("throws if an invalid password is provided", async () => {
    await service.signUp("salted@solomon.id","salted")
    await expect(service.signIn("salted@solomon.id", "wrongsalted"))
      .rejects
      .toThrow(BadRequestException)
  })

  it("returns the user if correct password is provided", async () => {
    await service.signUp("salted@solomon.id","salted")
    const user = await service.signIn("salted@solomon.id", "salted")
    expect(user).toBeDefined()
  })
})