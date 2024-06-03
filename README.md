# Backend

This is the **backend** part of our application, built with **Express.js** and **TypeScript**.

## Features

- **User Authentication**: Users can register and log in securely.
- **Session Management**: Sessions are managed with unique session IDs stored in cookies.
- **Note Management**: Authenticated users can create and retrieve their notes.

## Installation

1. **Clone this repository**.
2. Run `npm install` to install dependencies.
3. **Set up your environment variables** by creating a `.env` file and adding the necessary variables like `PORT` and `MY_SECRET`.
4. Run `npm start` to start the server.

## Dependencies

- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `dotenv`: Loads environment variables from a `.env` file into `process.env`.
- `cookie-parser`: Parses cookies attached to the client request object.
- `@prisma/client`: Prisma client library for TypeScript.
- `argon2`: Password hashing library.
- `uuid`: Library for generating unique IDs.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing (CORS).

## Endpoints

- `POST /register`: Register a new user.
- `POST /login


# Ertan Mutlu
