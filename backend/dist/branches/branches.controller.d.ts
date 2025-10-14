import { BranchesService } from './branches.service';
declare class CreateBranchDto {
    name: string;
    location: string;
}
declare class UpdateBranchDto {
    name?: string;
    location?: string;
}
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    list(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
    }[]>;
    create(dto: CreateBranchDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
    }>;
    update(id: string, dto: UpdateBranchDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
    }>;
}
export {};
