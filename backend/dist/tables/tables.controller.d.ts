import { TablesService } from './tables.service';
export declare class TablesController {
    private readonly tables;
    constructor(tables: TablesService);
    list(sectionId: string): Promise<{
        id: string;
        name: string;
        status: string;
        sectionId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    lock(id: string): Promise<{
        id: string;
        name: string;
        status: string;
        sectionId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    unlock(id: string): Promise<{
        id: string;
        name: string;
        status: string;
        sectionId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
