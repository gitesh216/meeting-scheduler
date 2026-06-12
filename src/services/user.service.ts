import { getAll, getById } from "../repositories/user.repository.js";

export async function findAllUsers() {
  const users = await getAll();
  return users;
}

export async function findUserById(id: number) {
  const user = await getById(id);
  return user;
}
