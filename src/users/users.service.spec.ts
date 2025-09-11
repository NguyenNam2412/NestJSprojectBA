import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { Role } from './role.enum';

// import { TypeOrmModule } from '@nestjs/typeorm'; // with real database

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User), // map userRepository
          useValue: mockUserRepository, // mock
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // test server generated success
  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  // test password hashed
  test('hashPassword works', async () => {
    const hash = await bcrypt.hash('123456', 10);
    expect(hash).not.toEqual('123456');
  });

  // test find all unit
  test('should return users list', async () => {
    mockUserRepository.find.mockResolvedValue([{ id: 1, username: 'nam' }]);
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, username: 'nam' }]);
  });

  // test find one
  test('should return one user', async () => {
    mockUserRepository.find.mockResolvedValue({ id: 1, username: 'nam' });
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, username: 'nam' }]);
  });

  // test find by username
  test('should return users matching the search keyword', async () => {
    const mockUsers = [
      { id: 1, username: 'nam123', email: 'a@test.com' },
      { id: 2, username: 'nguyennam', email: 'b@test.com' },
      { id: 2, username: 'test', email: 'b@test.com' },
    ] as User[];

    jest.spyOn(mockUserRepository, 'find').mockResolvedValue(mockUsers);

    const result = await service.searchByUsername('nam');

    expect(result).toEqual(mockUsers);
    expect(mockUserRepository.find).toHaveBeenCalledWith({
      where: { username: expect.any(Object) }, // ILike('%nam%')
    });
  });

  // test register
  test('return reg user', async () => {
    mockUserRepository.find.mockResolvedValue([{ id: 1, username: 'nam' }]);
    const data = { username: 'nam', email: 'nam@test.com', password: '123456' };
      const mockUser = { id: 1, ...data, role: Role.User } as User;

      jest.spyOn(mockUserRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(mockUserRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.register(data);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith({ ...data, role: Role.User });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });

  // test create
  test('return create user', async () => {
    const data = { username: 'admincreate', email: 'admin@test.com', password: '123456', role: Role.Admin };
    const mockUser = { id: 2, ...data } as User;

    jest.spyOn(mockUserRepository, 'create').mockReturnValue(mockUser);
    jest.spyOn(mockUserRepository, 'save').mockResolvedValue(mockUser);

    const result = await service.create(data);

    expect(result).toEqual(mockUser);
    expect(mockUserRepository.create).toHaveBeenCalledWith(data);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });

  // update
  test('return user update info', async () => {
    const id = 1;
      const updateData = { email: 'updated@test.com' };
      const updatedUser = { id, username: 'nam', email: 'updated@test.com', password: '123456', role: Role.User } as User;

      jest.spyOn(mockUserRepository, 'update').mockResolvedValue(undefined as any);
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(updatedUser);

      const result = await service.update(id, updateData);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(id, updateData);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({where: { id }});
  });

  // delete
  describe('remove', () => {
    it('should remove a user by id', async () => {
      const id = 1;

      jest.spyOn(mockUserRepository, 'delete').mockResolvedValue(undefined as any);

      await service.remove(id);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});

// with real database
// describe('UsersService', () => {
//   let service: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         TypeOrmModule.forRoot({
//           type: 'sqlite',
//           database: ':memory:',
//           entities: [User],
//           synchronize: true,
//         }),
//         TypeOrmModule.forFeature([User]),
//       ],
//       providers: [UsersService],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });