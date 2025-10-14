import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(req: any): Promise<{
        username: string;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        branchId: string | null;
    }>;
}
