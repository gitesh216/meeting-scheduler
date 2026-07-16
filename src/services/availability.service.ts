import {
    CreateAvailabilityExceptionDto,
    CreateAvailabilityRuleDto,
    UpdateAvailabilityExceptionDto,
    UpdateAvailabilityRuleDto,
} from "../dtos/availability.dto.js";
import {
    createException as createExceptionRepo,
    createRule as createRuleRepo,
    findExceptionById,
    findExceptionsByUser,
    findRuleById,
    findRulesByUser,
    removeException as removeExceptionRepo,
    removeRule as removeRuleRepo,
    updateException as updateExceptionRepo,
    updateRule as updateRuleRepo,
} from "../repositories/availability.repository.js";
import { startRegenerateHostSlotsWorkflow } from "../temporal/client.js";
import { forbidden, notFound } from "../utils/api-error.js";

export async function createRule(
    userId: number,
    data: CreateAvailabilityRuleDto,
) {
    const createdRule = await createRuleRepo(userId, data);
    await startRegenerateHostSlotsWorkflow({ hostId: createdRule.userId });
    return createdRule;
}

export async function listRules(userId: number) {
    const rules = await findRulesByUser(userId);
    if (!rules) {
        throw notFound("Rules not found");
    }
    return rules;
}

export async function updateRule(
    userId: number,
    ruleId: number,
    data: UpdateAvailabilityRuleDto,
) {
    const rule = await findRuleById(ruleId);
    if (!rule) {
        throw notFound("Rule not found");
    }
    if (rule.userId !== userId) {
        throw forbidden(
            "You are not authorized to update this availability rule",
        );
    }

    const updatedRule = await updateRuleRepo(ruleId, data);
    await startRegenerateHostSlotsWorkflow({ hostId: updatedRule.userId });
    return updatedRule;
}

export async function removeRule(userId: number, ruleId: number) {
    const rule = await findRuleById(ruleId);
    if (!rule) {
        throw notFound("Rule not found");
    }
    if (rule.userId !== userId) {
        throw forbidden(
            "You are not authorized to remove this availability rule",
        );
    }

    const removedRule = await removeRuleRepo(ruleId);
    await startRegenerateHostSlotsWorkflow({ hostId: removedRule.userId });
    return removedRule;
}

export async function createException(
    userId: number,
    data: CreateAvailabilityExceptionDto,
) {
    const createdException = await createExceptionRepo(userId, data);
    await startRegenerateHostSlotsWorkflow({ hostId: createdException.userId });
    return createdException;
}

export async function listExceptions(userId: number) {
    return findExceptionsByUser(userId);
}

export async function updateException(
    userId: number,
    exceptionId: number,
    data: UpdateAvailabilityExceptionDto,
) {
    const exception = await findExceptionById(exceptionId);
    if (!exception) {
        throw notFound("Availability Exception not found");
    }
    if (exception.userId !== userId) {
        throw forbidden(
            "You are not authorized to update this availability exception",
        );
    }

    const updatedException = await updateExceptionRepo(exceptionId, data);
    await startRegenerateHostSlotsWorkflow({ hostId: updatedException.userId });

    return updatedException;
}

export async function removeException(userId: number, exceptionId: number) {
    const exception = await findExceptionById(exceptionId);
    if (!exception) {
        throw notFound("Availability Exception not found");
    }
    if (exception.userId !== userId) {
        throw forbidden(
            "You are not authorized to remove this availability exception",
        );
    }

    const removedException = await removeExceptionRepo(exceptionId);
    await startRegenerateHostSlotsWorkflow({ hostId: removedException.userId });
    return removedException;
}
