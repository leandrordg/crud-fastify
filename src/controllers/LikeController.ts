import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { db } from "../lib/db";

const likeShema = z.object({
  authorId: z.string().optional(),
});

export default {
  async getAllUsersWhoLikedPost(request: FastifyRequest, reply: FastifyReply) {
    const { postId } = request.params as { postId: string };

    if (!postId) {
      reply
        .status(400)
        .send({ message: "Post ID is required", success: false });
    }

    const postExists = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      reply.status(404).send({ message: "Post not found", success: false });
    }

    const usersWhoLiked = await db.like.findMany({
      where: {
        postId,
      },
    });

    return reply.status(200).send(usersWhoLiked);
  },
  async likePost(request: FastifyRequest, reply: FastifyReply) {
    const { postId } = request.params as { postId: string };
    const { authorId } = likeShema.parse(request.body);

    if (!postId) {
      reply
        .status(400)
        .send({ message: "Post ID is required", success: false });
      return;
    }

    if (!authorId) {
      reply
        .status(400)
        .send({ message: "Author ID is required", success: false });
      return;
    }

    const postExists = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      reply.status(404).send({ message: "Post not found", success: false });
      return;
    }

    const userExists = await db.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!userExists) {
      reply.status(404).send({ message: "User not found", success: false });
      return;
    }

    const likeExists = await db.like.findFirst({
      where: {
        postId,
        authorId,
      },
    });

    if (likeExists) {
      reply.status(400).send({ message: "Post already liked", success: false });
      return;
    }

    await db.like.create({
      data: {
        authorId,
        postId,
      },
    });

    return reply.status(200).send({ message: "Post liked", success: true });
  },
  async unlikePost(request: FastifyRequest, reply: FastifyReply) {
    const { postId } = request.params as { postId: string };
    const { authorId } = likeShema.parse(request.body);

    if (!postId) {
      reply
        .status(400)
        .send({ message: "Post ID is required", success: false });
      return;
    }

    if (!authorId) {
      reply
        .status(400)
        .send({ message: "Author ID is required", success: false });
      return;
    }

    const postExists = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      reply.status(404).send({ message: "Post not found", success: false });
      return;
    }

    const userExists = await db.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!userExists) {
      reply.status(404).send({ message: "User not found", success: false });
      return;
    }

    const likeExists = await db.like.findFirst({
      where: {
        postId,
        authorId,
      },
    });

    if (!likeExists) {
      reply.status(400).send({ message: "Post not liked yet", success: false });
      return;
    }

    await db.like.delete({
      where: {
        id: likeExists.id,
      },
    });

    return reply.status(200).send({ message: "Post unliked", success: true });
  },
};
