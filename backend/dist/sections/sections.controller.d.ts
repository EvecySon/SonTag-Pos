import { SectionsService } from './sections.service';
export declare class SectionsController {
    private readonly sections;
    constructor(sections: SectionsService);
    list(branchId: string): Promise<{
        id: string;
        name: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
