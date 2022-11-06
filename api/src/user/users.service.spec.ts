import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
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
});
