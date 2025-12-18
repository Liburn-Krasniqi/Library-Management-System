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
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: JwtService;
  let config: ConfigService;

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const mockJwt = {
      signAsync: jest.fn(),
    };

    const mockConfig = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: require('../prisma/prisma.service').PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: mockJwt,
        },
        {
          provide: ConfigService,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(require('../prisma/prisma.service').PrismaService);
    jwt = module.get<JwtService>(JwtService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a user successfully', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      const hashedPassword = 'hashedPassword';
      const user = {
        id: 1,
        email: dto.email,
        name: dto.name,
        role: 'USER',
        createdAt: new Date(),
      };

      jest.spyOn(require('argon2'), 'hash').mockResolvedValue(hashedPassword);
      prisma.user.create.mockResolvedValue(user);

      const result = await service.signup(dto);

      expect(result).toEqual(user);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
    });

    it('should throw ForbiddenException for duplicate credentials', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      const error =
        new (require('@prisma/client/runtime/client').PrismaClientKnownRequestError)(
          'Unique constraint violation',
          { code: 'P2002', clientVersion: '4.0.0' },
        );

      jest.spyOn(require('argon2'), 'hash').mockResolvedValue('hashedPassword');
      prisma.user.create.mockRejectedValue(error);

      await expect(service.signup(dto)).rejects.toThrow(ForbiddenException);
    });
  });
});
