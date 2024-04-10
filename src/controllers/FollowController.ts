import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { db } from "../lib/db";

const followSchema = z.object({
  authorId: z.string().optional(),
});

export default {
  async getAllUserFollowers(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };

    if (!userId) {
      reply.status(400).send({ message: "Missing User ID", success: false });
      return;
    }

    const userExists = await db.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      reply.status(404).send({ message: "User not found", success: false });
      return;
    }

    const followers = await db.follows.findMany({
      where: { followingId: userId },
      select: {
        follower: true,
      },
    });

    const followersList = followers.map((follower) => follower.follower);

    return reply.status(200).send(followersList);
  },
  async getAllUserFollowing(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };

    if (!userId) {
      reply.status(400).send({ message: "Missing User ID", success: false });
      return;
    }

    const userExists = await db.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      reply.status(404).send({ message: "User not found", success: false });
      return;
    }

    const following = await db.follows.findMany({
      where: { followerId: userId },
      select: {
        following: true,
      },
    });

    const followingList = following.map((following) => following.following);

    return reply.status(200).send(followingList);
  },
  async followUser(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };
    const { authorId } = followSchema.parse(request.body);

    if (!userId || !authorId) {
      reply.status(400).send({ message: "Missing parameters", success: false });
      return;
    }

    const userExists = await db.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      reply.status(404).send({ message: "User not found", success: false });
      return;
    }

    const authorExists = await db.user.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      reply.status(404).send({ message: "Author not found", success: false });
      return;
    }

    if (userId === authorId) {
      reply
        .status(400)
        .send({ message: "You can't follow yourself", success: false });
      return;
    }

    const followExists = await db.follows.findFirst({
      where: {
        followerId: authorId,
        followingId: userId,
      },
    });

    if (followExists) {
      await db.follows.delete({
        where: {
          followerId_followingId: {
            followerId: authorId,
            followingId: userId,
          },
        },
      });

      return reply
        .status(200)
        .send({ message: "User unfollowed", success: true });
    }

    await db.follows.create({
      data: {
        followerId: authorId,
        followingId: userId,
      },
    });

    return reply.status(200).send({ message: "User followed", success: true });
  },
  async removeFollower(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };
    const { authorId } = followSchema.parse(request.body);

    if (!userId || !authorId) {
      reply.status(400).send({ message: "Missing parameters", success: false });
      return;
    }

    const userExists = await db.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      reply.status(404).send({ message: "User not found", success: false });
      return;
    }

    const authorExists = await db.user.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      reply.status(404).send({ message: "Author not found", success: false });
      return;
    }

    if (userId === authorId) {
      reply
        .status(400)
        .send({ message: "You can't remove yourself", success: false });
      return;
    }

    const followExists = await db.follows.findFirst({
      where: {
        followerId: userId,
        followingId: authorId,
      },
    });

    if (!followExists) {
      reply
        .status(404)
        .send({ message: "User is not following you", success: false });
      return;
    }

    await db.follows.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: authorId,
        },
      },
    });

    return reply
      .status(200)
      .send({ message: "Follower removed", success: true });
  },
};
