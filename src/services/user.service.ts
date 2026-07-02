import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";
import {
    create,
    findByEmail,
    getAll,
    getById,
    remove,
    update,
} from "../repositories/user.repository.js";
import { conflict, notFound } from "../utils/api-error.js";
import slug from "slug";

export async function findAllUsers() {
    const users = await getAll();
    return users;
}

export async function findUserById(id: number) {
    const user = await getById(id);
    if (!user) {
        throw notFound("User not found");
    }
    return user;
}

export async function createNewUser(data: CreateUserDto) {
    const existingUser = await findByEmail(data.email);

    if (existingUser) {
        throw conflict("User already exists");
    }
    const unique_slug_data = data.name + data.email;
    const user_slug = data.slug ?? slug(unique_slug_data, { lower: true });

    return create({ ...data, slug: user_slug });
}

export async function updateUser(id: number, data: UpdateUserDto) {
    const user = await getById(id);
    if (!user) {
        throw notFound("User not found");
    }

    if (data.email && data.email !== user.email) {
        const existingUser = await findByEmail(data.email);
        if (existingUser) {
            throw conflict("User already exists");
        }
    }

    return update(id, data);
}

export async function deleteUser(id: number) {
    const user = await getById(id);
    if (!user) {
        throw notFound("User not found");
    }

    return remove(id);
}
