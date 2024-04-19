# 📝 CRUD Posts with Node.js, Fastify, Zod, and Prisma ORM

## 📚 About The Project

This project is a CRUD (Create, Read, Update, Delete) posts application built with **Node.js (TypeScript)**, using **Fastify** for the server framework, **Zod** for validation, and **Prisma ORM** for interaction with the **PostgreSQL** database.

## 🚀 Features

### Post:
- **Create**: Users can create new posts.
- **Like**: Users can like posts.
- **Update**: Users can update their posts.
- **Delete**: Users can delete their posts.

### Comment:
- **Create**: Users can comment on posts.
- **Like**: Users can like comments.
- **Delete**: Users can delete their comments.
- **Update**: Users can update their comments.

### User:
- **Follow**: Users can follow other users.
- **Remove Follower**: Users can remove followers.

## 💻 Technologies Used

- **Node.js (TypeScript)**: We use Node.js, a JavaScript runtime, to build the server-side logic.
- **Fastify**: Fastify is used as the server framework for our application.
- **Zod**: Zod is used for schema validation in our application.
- **Prisma ORM**: Prisma is an object-relational mapper (ORM) that makes it easy to interact with our PostgreSQL database.

## 🛠️ Optional Extension

- **REST Client**: An optional extension used for making HTTP requests, similar to Postman, but directly within VS Code. If you install the extension, there will already be pre-configured routes in the "src/routes" directory.

## 🏃‍♂️ How To Run The Project

1. Clone the repository to your local machine using `git clone`.
2. Install all project dependencies with `pnpm install`.
3. Set up your environment variables. You will need your PostgreSQL credentials.
4. Run the project locally with `pnpm run dev`.

## 🤝 Contribution

Contributions are always welcome! Please read the contribution guidelines first.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
