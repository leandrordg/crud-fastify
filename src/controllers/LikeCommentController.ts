import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { db } from "../lib/db";

const commentLikeSchema = z.object({
  authorId: z.string().optional(),
});

export default {
  async likeComment(request: FastifyRequest, reply: FastifyReply) {
    const { postId, commentId } = request.params as {
      postId: string;
      commentId: string;
    };
    const { authorId } = commentLikeSchema.parse(request.body);

    if (!postId) {
      reply
        .status(400)
        .send({ message: "Post ID is required", success: false });
      return;
    }

    if (!commentId) {
      reply
        .status(400)
        .send({ message: "Comment ID is required", success: false });
      return;
    }

    if (!authorId) {
      reply
        .status(400)
        .send({ message: "Author ID is required", success: false });
      return;
    }

    const userExists = await db.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!userExists) {
      reply.status(400).send({ message: "User not found", success: false });
      return;
    }

    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      reply.status(400).send({ message: "Comment not found", success: false });
      return;
    }

    if (comment.postId !== postId) {
      reply
        .status(400)
        .send({ message: "Comment not found in this post", success: false });
      return;
    }

    const commentLikeExist = await db.commentLike.findFirst({
      where: {
        commentId,
        authorId,
      },
    });

    if (commentLikeExist) {
      reply
        .status(400)
        .send({ message: "Comment already liked", success: false });
      return;
    }

    await db.commentLike.create({
      data: {
        commentId,
        authorId,
      },
    });

    reply.status(200).send({ message: "Comment liked", success: true });
  },
  async unlikeComment(request: FastifyRequest, reply: FastifyReply) {
    const { postId, commentId } = request.params as {
      postId: string;
      commentId: string;
    };
    const { authorId } = commentLikeSchema.parse(request.body);

    if (!postId) {
      reply
        .status(400)
        .send({ message: "Post ID is required", success: false });
      return;
    }

    if (!commentId) {
      reply
        .status(400)
        .send({ message: "Comment ID is required", success: false });
      return;
    }

    if (!authorId) {
      reply
        .status(400)
        .send({ message: "Author ID is required", success: false });
      return;
    }

    const userExists = await db.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!userExists) {
      reply.status(400).send({ message: "User not found", success: false });
      return;
    }

    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      reply.status(400).send({ message: "Comment not found", success: false });
      return;
    }

    if (comment.postId !== postId) {
      reply
        .status(400)
        .send({ message: "Comment not found in this post", success: false });
      return;
    }

    const commentLikeExist = await db.commentLike.findFirst({
      where: {
        commentId,
        authorId,
      },
    });

    if (!commentLikeExist) {
      reply
        .status(400)
        .send({ message: "Comment not liked yet", success: false });
      return;
    }

    await db.commentLike.delete({
      where: {
        id: commentLikeExist.id,
      },
    });

    reply.status(200).send({ message: "Comment unliked", success: true });
  },
};
