import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../lib/db";
import { z } from "zod";

const commentSchema = z.object({
  authorId: z.string().optional(),
  content: z.string().optional(),
});

export default {
  async getAllCommentsFromPost(request: FastifyRequest, reply: FastifyReply) {
    const { postId } = request.params as { postId: string };

    if (!postId) {
      reply
        .status(400)
        .send({ message: "Post ID is required", success: false });
      return;
    }

    const postExists = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      reply.status(400).send({ message: "Post not found", success: false });
      return;
    }

    const comments = await db.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!comments) {
      reply.status(200).send({ message: "No comments found", success: true });
      return;
    }

    reply.status(200).send(comments);
  },
  async createCommentByPost(request: FastifyRequest, reply: FastifyReply) {
    const { postId } = request.params as { postId: string };
    const { authorId, content } = commentSchema.parse(request.body);

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

    if (!content) {
      reply
        .status(400)
        .send({ message: "Content is required", success: false });
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

    const postExists = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      reply.status(400).send({ message: "Post not found", success: false });
      return;
    }

    await db.comment.create({
      data: {
        authorId,
        postId,
        content,
      },
    });

    reply.status(201).send({ message: "Comment created", success: true });
  },
  async updateComment(request: FastifyRequest, reply: FastifyReply) {
    const { postId, commentId } = request.params as {
      postId: string;
      commentId: string;
    };
    const { content, authorId } = commentSchema.parse(request.body);

    if (!postId) {
      reply
        .status(400)
        .send({ message: "Comment ID is required", success: false });
      return;
    }

    if (!commentId) {
      reply
        .status(400)
        .send({ message: "Comment ID is required", success: false });
      return;
    }

    if (!content) {
      reply
        .status(400)
        .send({ message: "Content is required", success: false });
      return;
    }

    if (!authorId) {
      reply
        .status(400)
        .send({ message: "Author ID is required", success: false });
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

    if (comment.authorId !== authorId) {
      reply
        .status(400)
        .send({ message: "You can't update this comment", success: false });
      return;
    }

    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
        updated: true,
      },
    });

    reply.status(200).send({ message: "Comment updated", success: true });
  },
  async deleteComment(request: FastifyRequest, reply: FastifyReply) {
    const { postId, commentId } = request.params as {
      postId: string;
      commentId: string;
    };
    const { authorId } = commentSchema.parse(request.body);

    if (!postId) {
      reply
        .status(400)
        .send({ message: "Comment ID is required", success: false });
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

    if (comment.authorId !== authorId) {
      reply
        .status(400)
        .send({ message: "You can't delete this comment", success: false });
      return;
    }

    await db.comment.delete({
      where: {
        id: commentId,
      },
    });

    reply.status(200).send({ message: "Comment deleted", success: true });
  },
};
