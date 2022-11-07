import {createMock} from "@golevelup/ts-jest";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {Test} from "@nestjs/testing";
import {User} from "../user/user.entity";
import {UsersModule} from "../user/users.module";
import {UsersService} from "../user/users.service";
import {AuthService} from "./auth.service";

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: JwtService, useValue: createMock<JwtService>() },
            ],
        })
        .compile();
   
        authService = moduleRef.get<AuthService>(AuthService);
        usersService = moduleRef.get<UsersService>(UsersService);
        jwtService = moduleRef.get<JwtService>(JwtService);
    });

    describe('register', () => {
        it('should register a user, when given a non registered user', async() => {
            const createUser = {
                email: 'example@hotmail.com',
                password: '1234568',
            };

            const expected = new User();
            expected.id = 1;
            expected.email = createUser.email;
            expected.password = '12345678';

            jest.spyOn(usersService, 'findOneByEmail')
                .mockReturnValue(null);

            const usersServiceSpy = jest.spyOn(usersService, 'create')
                .mockReturnValue(new Promise(resolve => resolve(expected)));

            const user = await authService.register(createUser);
            expect(usersServiceSpy).toBeCalled();
            expect(user).toEqual(expected);
        });

        it('should throw an exception, when trying to register a user that already exists', async() => {
            const createUser = {
                email: 'example@hotmail.com',
                password: '1234568',
            };

            const userMock = new User();
            userMock.id = 1;
            userMock.email = createUser.email;
            userMock.password = createUser.password; 

            jest.spyOn(usersService, 'findOneByEmail')
                .mockReturnValue(new Promise(resolve => resolve(userMock)));

            await expect(async() => {await authService.register(createUser)}).rejects.toThrow('Email already exists');
        });
    });

    describe('validateUser', () => {
        it('should return id and email, if the user email is found and passwords matches', async() => {
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.email = 'example@gmail.com';
            mockUser.password = '$2a$10$qM9OdCqsP5wjvwVPzZsmwOmpJBoLZ9Y4HLHhwYqDtROxncRIsVUfe';
            mockUser.isActive = true;

            const usersServiceSpy = jest.spyOn(usersService, 'findOneByEmail')
                .mockReturnValue(new Promise(resolve => resolve(mockUser)));

            const payload = await authService.validateUser(mockUser.email, '12345678');
            expect(payload).toHaveProperty('id', mockUser.id); 
            expect(payload).toHaveProperty('email', mockUser.email);
            expect(payload).not.toHaveProperty('password');
            expect(payload).not.toHaveProperty('isActive');
        });

        it('should return null,if user is not found or passwords does not matches', async() => {
            jest.spyOn(usersService, 'findOneByEmail')
                .mockReturnValue(null);

            const payload = await authService.validateUser('example@gmail.com', '12345678');

            expect(payload).toEqual(null);
        });

    });
});
