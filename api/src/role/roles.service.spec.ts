import {createMock} from "@golevelup/ts-jest";
import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Role} from "./role.entity";
import {RolesService} from "./roles.service";

describe('RolesService', () => {
    let rolesService: RolesService;
    let rolesRepository: Repository<Role>;

    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                RolesService,
                { provide: getRepositoryToken(Role), useValue: createMock<Repository<Role>>() },
            ],
        }).compile();

        rolesService = moduleRef.get<RolesService>(RolesService);
        rolesRepository = moduleRef.get<Repository<Role>>(getRepositoryToken(Role));
    });

    describe('findAllRoles', () => {
        it('should return all roles', async() => {
            const expected: Role[] = [];
            const role = new Role();
            role.id = 1;
            role.name = 'admin';
            expected.push(role);

            jest.spyOn(rolesRepository, 'find')
                .mockReturnValue(new Promise(resolve => resolve(expected)));

            const roles = await rolesService.findAllRoles();
            expect(roles).toEqual(expected);
        });
    });
});
