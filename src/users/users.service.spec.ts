import { UsersService } from "./users.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("User Service", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers:[UsersService]
    }).compile();

    service = module.get<UsersService>(UsersService);
  })

  it("should can create an instance for user service", async () => {
    expect(service).toBeDefined();
  })
});
