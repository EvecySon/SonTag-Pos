import { PrismaService } from '../prisma/prisma.service';
interface CreateOrderItem {
    productId: string;
    qty: number;
    price: string;
}
interface PaymentDto {
    method: string;
    amount: string;
    reference?: string;
}
interface CreateOrderDto {
    branchId: string;
    items: CreateOrderItem[];
    payment?: PaymentDto;
}
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    list(branchId?: string, from?: string, to?: string): Promise<({
        items: {
            id: string;
            createdAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        branchId: string;
        userId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(dto: CreateOrderDto, userId?: string): Promise<({
        [x: string]: {
            id: string;
            createdAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
        }[] | ({
            id: string;
            createdAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
        } | {
            id: string;
            createdAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
        })[] | ({
            id: string;
            createdAt: Date;
            orderId: string;
            method: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            reference: string | null;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
        } | {
            id: string;
            createdAt: Date;
            orderId: string;
            method: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            reference: string | null;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
        })[] | {
            id: string;
            createdAt: Date;
            orderId: string;
            method: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            reference: string | null;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        [x: number]: never;
        [x: symbol]: never;
    } & {
        id: string;
        branchId: string;
        userId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
export {};
