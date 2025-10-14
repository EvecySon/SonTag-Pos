import { AuthService } from './auth.service';
declare class RegisterDto {
    username: string;
    email: string;
    password: string;
    branchName: string;
    branchLocation: string;
}
declare class LoginDto {
    username: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            token: string;
            user: {
                username: string;
                email: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
                branchId: string | null;
            };
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            branchId: string | null;
        };
    }>;
}
export {};
