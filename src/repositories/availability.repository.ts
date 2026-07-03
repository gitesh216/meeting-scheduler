import { prisma } from "../config/database.js";
import {
    CreateAvailabilityExceptionDto,
    CreateAvailabilityRuleDto,
    UpdateAvailabilityRuleDto,
} from "../dtos/availability.dto.js";

export async function findRulesByUser(userId: number) {
    const rules = await prisma.availabilityRule.findMany({
        where: {
            userId,
        },
        orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
    });
    return rules;
}

export async function findActiveRulesByUser(userId: number) {
    const activeRules = await prisma.availabilityRule.findMany({
        where: {
            userId,
            isActive: true,
        },
        orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
    });
    return activeRules;
}

export async function findRuleById(id: number) {
    const rule = await prisma.availabilityRule.findUnique({
        where: {
            id,
        },
    });
    return rule;
}

export async function createRule(
    userId: number,
    data: CreateAvailabilityRuleDto,
) {
    const newRule = await prisma.availabilityRule.create({
        data: {
            userId,
            ...data,
        },
    });
    return newRule;
}

export async function updateRule(id: number, data: UpdateAvailabilityRuleDto) {
    const updatedRule = await prisma.availabilityRule.update({
        where: {
            id,
        },
        data,
    });
    return updatedRule;
}

export async function removeRule(id: number) {
    const remRule = await prisma.availabilityRule.delete({
        where: {
            id,
        },
    });
    return remRule;
}

export async function findExceptionsByUser(userId: number) {
    const exceptions = await prisma.availabilityException.findMany({
        where: {
            userId,
        },
        orderBy: {
            date: "asc",
        },
    });
    return exceptions;
}

export async function findExceptionById(id: number) {
    const exception = await prisma.availabilityException.findUnique({
        where: {
            id,
        },
    });
    return exception;
}

export async function createException(
    userId: number,
    data: CreateAvailabilityExceptionDto,
) {
    const { date, ...rest } = data;
    const newException = await prisma.availabilityException.create({
        data: {
            userId,
            date: new Date(`${date}T00:00:00.000Z`),
            ...rest,
        },
    });
    return newException;
}

export async function removeException(id: number) {
    const remException = await prisma.availabilityException.delete({
        where: {
            id,
        },
    });
    return remException;
}

export async function findExceptionsByUserInRange(
    userId: number,
    startDate: Date,
    endDate: Date,
) {
    const exceptions = await prisma.availabilityException.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: {
            date: "asc",
        },
    });
    return exceptions;
}
