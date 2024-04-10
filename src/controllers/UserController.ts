import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { db } from "../lib/db";

const userSchema = z.object({
  first_name: z.string().optional(),
  email_address: z.string().email().optional(),
});

export default {
  async getAllAccounts(request: FastifyRequest, reply: FastifyReply) {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        first_name: true,
        email_address: true,
        createdAt: true,
        _count: true,
      },
    });

    reply.status(200).send(users);
  },
  async getAccountById(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };

    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        first_name: true,
        email_address: true,
        createdAt: true,
        _count: true,
      },
    });

    if (!user) {
      reply.status(400).send({ message: "User not found", success: false });
      return;
    }

    reply.status(200).send(user);
  },
  async createAccount(request: FastifyRequest, reply: FastifyReply) {
    const { first_name, email_address } = userSchema.parse(request.body);

    if (!email_address) {
      reply.status(400).send({ message: "Email are required", success: false });
      return;
    }

    if (!first_name) {
      reply
        .status(400)
        .send({ message: "First name are required", success: false });
      return;
    }

    const emailAlreadyExists = await db.user.findFirst({
      where: {
        email_address,
      },
    });

    if (emailAlreadyExists) {
      reply
        .status(400)
        .send({ message: "Email already exists", success: false });
      return;
    }

    await db.user.create({
      data: {
        first_name,
        email_address,
      },
    });

    reply.status(201).send({ message: "User created", success: true });
  },
  async updateAccount(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };

    const userIdExists = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userIdExists) {
      reply.status(400).send({ message: "User not found", success: false });
      return;
    }

    const { first_name, email_address } = userSchema.parse(request.body);

    await db.user.update({
      where: { id: userId },
      data: {
        first_name,
        email_address,
      },
    });

    reply.status(200).send({ message: "User updated", success: true });
  },
  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };

    const userIdExists = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userIdExists) {
      reply.status(400).send({ message: "User not found", success: false });
      return;
    }

    await db.user.delete({
      where: {
        id: userId,
      },
    });

    reply.status(200).send({ message: "User deleted", success: true });
  },
};
