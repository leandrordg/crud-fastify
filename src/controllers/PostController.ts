import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { db } from "../lib/db";

const postSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  authorId: z.string().optional(),
});

export default {
  async getAllPosts(request: FastifyRequest, reply: FastifyReply) {
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: true,
      },
    });

    return reply.status(200).send(posts);
  },
  async getPostById(request: FastifyRequest, reply: FastifyReply) {
    const { postId } = request.params as { postId: string };

    if (!postId) {
      return reply
        .code(400)
        .send({ message: "Post ID is required!", success: false });
    }

    const post = await db.post.findUnique({
      where: {
        id: postId,
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

    if (!post) {
      return reply
        .code(404)
        .send({ message: "Post not found!", success: false });
    }

    return reply.status(200).send(post);
  },
  async getPostsByUser(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };

    const userExists = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      return reply
        .code(404)
        .send({ message: "User not found!", success: false });
    }

    const posts = await db.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: true,
      },
    });

    if (!posts) {
      return reply
        .code(404)
        .send({ message: "No posts found!", success: false });
    }

    return reply.status(200).send(posts);
  },
  async createPost(request: FastifyRequest, reply: FastifyReply) {
    const { title, content, authorId } = postSchema.parse(request.body);

    if (!title || !authorId) {
      return reply
        .code(400)
        .send({ message: "Title and authorId are required!", success: false });
    }

    const userExists = await db.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!userExists) {
      return reply
        .code(404)
        .send({ message: "User not found!", success: false });
    }

    await db.post.create({
      data: {
        title,
        content: content || "",
        authorId,
      },
    });

    return reply
      .code(201)
      .send({ message: "Post created successfully!", success: true });
  },
  async updatePost(request: FastifyRequest, reply: FastifyReply) {
    const { postId } = request.params as { postId: string };
    const { title, content, authorId } = postSchema.parse(request.body);

    if (!postId) {
      return reply
        .code(400)
        .send({ message: "Post ID is required!", success: false });
    }

    if (!title) {
      return reply
        .code(400)
        .send({ message: "Title is required!", success: false });
    }

    // Verification if the user that will update the post is the author

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return reply
        .code(404)
        .send({ message: "Post not found!", success: false });
    }

    if (post.authorId !== authorId) {
      return reply.code(401).send({
        message: "You are not authorized to update this post!",
        success: false,
      });
    }

    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        updated: true,
      },
    });

    return reply
      .code(200)
      .send({ message: "Post updated successfully!", success: true });
  },
  async deletePost(request: FastifyRequest, reply: FastifyReply) {
    const { postId } = request.params as { postId: string };
    const { authorId } = request.body as { authorId: string };

    if (!postId) {
      return reply
        .code(400)
        .send({ message: "Post ID is required!", success: false });
    }

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return reply
        .code(404)
        .send({ message: "Post not found!", success: false });
    }

    if (post.authorId !== authorId) {
      return reply.code(401).send({
        message: "You are not authorized to delete this post!",
        success: false,
      });
    }

    await db.post.delete({
      where: {
        id: postId,
      },
    });

    return reply
      .code(200)
      .send({ message: "Post deleted successfully!", success: true });
  },
};
