# Password-vault

A Next.js application with MongoDB integration.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install

```

### 3. Environment Setup

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure your environment variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Add other environment variables as needed
```

### 4. MongoDB Setup

#### Using MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster
4. Click "Connect" and choose "Connect your application"
5. Copy the connection string and replace `<password>` with your database user password
6. Paste the connection string in your `.env.local` file as `MONGODB_URI`

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database_name?retryWrites=true&w=majority
```
```
MONGODB_URI=mongodb://localhost:27017/your_database_name
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 6. Verify MongoDB Connection

The application should automatically connect to MongoDB on startup. Check the console for connection messages.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm start` - Starts the production server

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
