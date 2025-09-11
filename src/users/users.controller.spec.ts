import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, username: 'test' }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  // test userController generated success
  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // test find one user
  test('should return a user by id', async () => {
    expect(await controller.findOne(1)).toEqual({ id: 1, username: 'test' });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  test('should return users matching the search keyword', async () => {
    const mockUsers = [
      { id: 1, username: 'nam123', email: 'a@test.com' },
      { id: 2, username: 'nguyennam', email: 'b@test.com' },
      { id: 2, username: 'test', email: 'b@test.com' },
    ] as User[];

    (service.searchByUsername as jest.Mock).mockResolvedValue(mockUsers);

    const result = await controller.searchByUsername('nam');

    expect(result).toEqual(mockUsers);
    expect(service.searchByUsername).toHaveBeenCalledWith('nam');
  });
});
