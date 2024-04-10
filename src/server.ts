import fastify from "fastify";

import UserController from "./controllers/UserController";
import PostController from "./controllers/PostController";
import CommentController from "./controllers/CommentController";
import LikeController from "./controllers/LikeController";
import LikeCommentController from "./controllers/LikeCommentController";
import FollowController from "./controllers/FollowController";

export const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

// USUÁRIO
server.get("/users", UserController.getAllAccounts);
server.get("/u/:userId", UserController.getAccountById);
server.post("/u/create", UserController.createAccount);
server.put("/u/:userId/update", UserController.updateAccount);
server.delete("/u/:userId/delete", UserController.deleteAccount);

// FOLLOW
server.get("/u/:userId/followers", FollowController.getAllUserFollowers);
server.get("/u/:userId/following", FollowController.getAllUserFollowing);
server.put("/u/:userId/follow", FollowController.followUser);
server.delete("/u/:userId/follower/remove", FollowController.removeFollower);

// POST
server.get("/posts", PostController.getAllPosts);
server.get("/post/:postId", PostController.getPostById);
server.get("/u/:userId/posts", PostController.getPostsByUser);
server.post("/post/create", PostController.createPost);
server.put("/post/:postId/update", PostController.updatePost);
server.delete("/post/:postId/delete", PostController.deletePost);

// COMMENT
server.get("/post/:postId/comments", CommentController.getAllCommentsFromPost);
server.post("/post/:postId/comment/create", CommentController.createCommentByPost);
server.put("/post/:postId/comment/:commentId/update", CommentController.updateComment);
server.delete("/post/:postId/comment/:commentId/delete", CommentController.deleteComment);

// LIKE
server.get("/post/:postId/likes", LikeController.getAllUsersWhoLikedPost);
server.put("/post/:postId/like", LikeController.likePost);
server.put("/post/:postId/unlike", LikeController.unlikePost);

// LIKE COMMENT
server.put("/post/:postId/comment/:commentId/like", LikeCommentController.likeComment);
server.put("/post/:postId/comment/:commentId/unlike", LikeCommentController.unlikeComment);

server.listen({ port: 3333 });
