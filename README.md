# Wholesale Delivery Management

An application to manage wholesale deliveries with features like product management, and secure user authentication.

## Table of Contents

1. [Prerequisites](#Prerequisites)
2. [Setting Up Locally](#setting-up-locally)
   - [Server Setup](#2-server-setup)
   - [Client Setup](#3-client-setup)
3. [Accessing the Deployed Version](#accessing-the-deployed-version)
4. [Technologies Used](#technologies-used)

## Prerequisites

Before setting up the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (for JavaScript/Node.js applications)
- [npm](https://www.npmjs.com/) (for managing project dependencies)
- [Git](https://git-scm.com/) (for version control)

## Setting Up Locally

Follow these steps to set up and run the application locally:

### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/muhammedfarzin/wholesale-delivery-management.git
cd wholesale-delivery-management
```

---

### 2. Server Setup

The backend of this project is built using Express.js. Follow these steps to set it up locally:

#### 2.1. Install Dependencies

Navigate to the `server` directory and install the necessary dependencies:

```bash
cd server
npm install
```

#### 2.2. Configure Environment Variables

Create a `.env` file in the `server/` directory and populate it with the following values:

```env
# Server Config
PORT= # Port number to run the server

# Database
MONGO_URI=# MongoDB connection URL

# JWT
JWT_ACCESS_SECRET=# JWT Access Secret
JWT_REFRESH_SECRET=# JWT Refresh Secret

# CORS
CLIENT_URL=# CORS Origin URL

# Cloudinary Config
CLOUD_NAME=# Cloudinary Cloud Name
CLOUD_API_KEY=# Cloudinary API Key
CLOUD_API_SECRET=# Cloudinary API Secret
```

#### 2.3. Run the Server

Start the server in development mode:

```bash
npm run dev
```

Alternatively, to run the server in production mode, first build the server and then start it:

```bash
npm run build
npm start
```

This will build and start the production version of the server, optimized for deployment.

---

### 3. Client Setup

The frontend of this project is built using React.js. Follow these steps to set it up locally:

#### 3.1. Install Dependencies

Navigate to the `client` directory and install the necessary dependencies:

```bash
cd client
npm install
```

#### 3.2. Configure Environment Variables (For Development Only)

> **Note:** The configuration of environment variables is only required for the development environment. For production, these variables should be securely managed through the server's hosting environment.

Create a `.env` file in the `client/` directory with the following content:

```env
VITE_API_BASE_URL=# URL of the backend server
```

Replace # with the actual backend server URL (e.g., http://localhost:3000 for local development). This will configure the client to communicate with the backend.

#### 3.3. Run the Client

Start the React development server:

```bash
npm start
```

This will run the client on a local server (typically on `http://localhost:3000`), where you can access the frontend of the application. The client will be running and communicating with the server based on the environment variables you have configured.

To stop the development server, press `Ctrl + C` in your terminal.

## Accessing the Deployed Version

Once everything is set up and running, you can access the live version of the application. The deployed version of the app can be accessed at the following URL:

- [**Live URL**](https://m1.farzin.in)

Feel free to explore the features of the application directly through the live environment.

## Technologies Used

This project is built using a combination of modern web technologies to provide a seamless and efficient experience for both developers and users. Below are the core technologies used in this project:

- **Frontend**:
  - **React.js**: A JavaScript library for building user interfaces. React allows for the development of fast, dynamic, and responsive UIs.
  - **TypeScript**: A superset of JavaScript that adds static types, which helps improve code quality and maintainability. Used in the frontend for better type safety and developer experience.
  - **TailwindCSS**: A utility-first CSS framework that allows for rapid UI development and customization with minimal effort.
- **Backend**:

  - **Express.js**: A fast and minimalist web framework for Node.js used to build the backend API.
  - **TypeScript**: Used in the backend as well to provide type safety, better code maintainability, and a streamlined developer experience.
  - **MongoDB**: A NoSQL database used for storing and managing data. MongoDB is flexible and scalable, making it a great choice for applications with dynamic data requirements.
  - **JWT (JSON Web Token)**: A compact and secure way to transmit information between a client and a server, primarily used for user authentication and authorization.

- **Cloud Integration**:

  - **Cloudinary**: A cloud-based image and video management service used for storing, transforming, and delivering media files.
