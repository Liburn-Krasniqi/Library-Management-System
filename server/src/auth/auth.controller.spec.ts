jest.doMock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  })),
}));

jest.doMock('generated/prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({})),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup with correct dto', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      const result = { id: 1, email: dto.email, name: dto.name };

      authService.signup = jest.fn().mockResolvedValue(result);

      const response = await controller.signup(dto);

      expect(authService.signup).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('signin', () => {
    it('should return user info and token', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      const user = { name: 'Test User', role: 'USER' };
      const token = { access_token: 'jwt-token' };

      userService.getUserByEmail = jest.fn().mockResolvedValue(user);
      authService.login = jest.fn().mockResolvedValue(token);

      const result = await controller.signin(dto);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        name: user.name,
        role: user.role,
        access_token: token.access_token,
      });
    });
  });
});
