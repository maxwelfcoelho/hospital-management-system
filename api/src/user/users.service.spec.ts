import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Role} from "../role/role.entity";
import {Repository} from "typeorm";
import {User} from "./user.entity";
import {UsersService} from "./users.service";

describe('UsersService', () => {
    let usersService: UsersService;
    let usersRepository: Repository<User>;

    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOneBy: jest.fn(() => {}),
                        save: jest.fn(() => {}),
                    }
                }
            ],

        }).compile();

        usersService = moduleRef.get<UsersService>(UsersService);
        usersRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('findOneById', () => {
        it('should get a single user, if id exists', async() => {
            const userMock = new User();
            userMock.id = 1;
            userMock.email = 'example@hotmail.com';
            userMock.password = '12345678';

            const usersRepositorySpy = jest.spyOn(usersRepository, 'findOneBy').mockReturnValue(new Promise(resolve => resolve(userMock)));

            const user = await usersService.findOneById(1);

            expect(usersRepositorySpy).toBeCalledWith({id: 1});
            expect(user).toEqual(userMock);
        });

        it('should return null, if user with id is not present', async() => {
            const usersRepositorySpy = jest.spyOn(usersRepository, 'findOneBy')
                .mockReturnValue(null);

            const user = await usersService.findOneById(100);
            
            expect(usersRepositorySpy).toBeCalledWith({id: 100});
            expect(user).toBe(null);
        });
    });

    describe('findOneByEmail', () => {
        it('should return user, if user with given id is found', async() => {
            const userMock = new User();
            userMock.id = 1;
            userMock.email = 'example@hotmail.com';
            userMock.password = '12345678';

            const usersRepositorySpy = jest.spyOn(usersRepository, 'findOneBy')
                .mockReturnValue(new Promise(resolve => resolve(userMock)));

            const user = await usersService.findOneByEmail('example@hotmail.com');

            expect(usersRepositorySpy).toBeCalledWith({email: userMock.email});
            expect(user).toEqual(userMock);
        });

        it('should return null, if user with given is is not found', async() => {
            const usersRepositorySpy = jest.spyOn(usersRepository, 'findOneBy')
                .mockReturnValue(null);

            const user = await usersService.findOneByEmail('notregistered@gmail.com');

            expect(usersRepositorySpy).toBeCalledWith({ email: 'notregistered@gmail.com' });
            expect(user).toBe(null);
        });
    });

    describe('create', () => {
        it('should create a user', async() => {
            const role = new Role();
            role.id = 3;
            role.name = 'patient';

            const expected = new User();
            expected.id = 1;
            expected.email = 'example@hotmail.com';
            expected.password = '12345678';
            expected.role = role;

            const usersRepositorySpy = jest.spyOn(usersRepository, 'save')
                .mockReturnValue(new Promise(resolve => resolve(expected)));

            const createUserDto = {
                email: 'example@hotmail.com',
                password: '12345678',
                role,
            };

            const user = await usersService.create(createUserDto);
            expect(usersRepositorySpy).toBeCalledWith(createUserDto);
            expect(user).toHaveProperty('id', expected.id);
            expect(user).toHaveProperty('email', createUserDto.email);
            expect(user).toHaveProperty('password', createUserDto.password);
            expect(user).toHaveProperty('role', expected.role);
        });
    });
});
