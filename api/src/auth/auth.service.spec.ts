import {createMock} from "@golevelup/ts-jest";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {Test} from "@nestjs/testing";
import {Role} from "../role/role.entity";
import {RolesService} from "../role/roles.service";
import {User} from "../user/user.entity";
import {UsersModule} from "../user/users.module";
import {UsersService} from "../user/users.service";
import {AuthService} from "./auth.service";

// TODO: unit tests are taking ten seconds to run only two tests,
// try to investigate the problem.

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;
    let rolesService: RolesService;

    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: JwtService, useValue: createMock<JwtService>() },
                { provide: RolesService, useValue: createMock<RolesService>() },
            ],
        })
        .compile();
   
        authService = moduleRef.get<AuthService>(AuthService);
        usersService = moduleRef.get<UsersService>(UsersService);
        jwtService = moduleRef.get<JwtService>(JwtService);
        rolesService = moduleRef.get<RolesService>(RolesService);
    });

    describe('register', () => {
        it('should register a user, when given a non registered user', async() => {
            const createUser = {
                email: 'example@hotmail.com',
                password: '1234568',
            };

            const role = new Role();
            role.id = 3;
            role.name = 'patient';

            const expected = new User();
            expected.id = 1;
            expected.email = createUser.email;
            expected.password = '12345678';
            expected.role = role;

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

    describe('login', () => {
        it('should return a jwt token with an email and id payload', async() => {
            const user = new User();
            user.id = 1;
            user.email = 'example@gmail.com';
            user.password = '$2a$10$qM9OdCqsP5wjvwVPzZsmwOmpJBoLZ9Y4HLHhwYqDtROxncRIsVUfe';
            user.isActive = true;

            const payload = { email: user.email, sub: user.id };

            const jwtServiceSpy = jest.spyOn(jwtService, 'sign')
                .mockReturnValue('jwt');

            const token = await authService.login(user);

            expect(jwtServiceSpy).toBeCalledWith(payload);
            expect(token).toEqual(expect.any(String));
        });
    });
});
