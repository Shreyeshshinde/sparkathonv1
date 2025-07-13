# Shopping Pod - Collaborative Shopping App

A real-time collaborative shopping app built with Next.js, WebSocket, and PostgreSQL. Users can create shopping pods, invite members, and collaboratively manage shopping lists with real-time updates.

## Features

- **Real-time Collaboration**: Live updates when members add/remove items
- **Pod Management**: Create and join shopping pods with invite codes
- **Database Integration**: Persistent storage with PostgreSQL and Prisma
- **WebSocket Communication**: Real-time updates across all pod members
- **User Attribution**: Track who added each item
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, WebSocket Server
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: WebSocket for live updates
- **Authentication**: Clerk (integrated)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. **Set up your database connection** in `.env`:

```env
DATABASE_URL="your_postgresql_connection_string"
```

2. **Run database migrations**:

```bash
npx prisma migrate dev
```

3. **Generate Prisma client**:

```bash
npx prisma generate
```

### 3. Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="your_postgresql_connection_string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Start the Development Servers

You need to run **two servers** for full functionality:

#### Terminal 1: Next.js App

```bash
npm run dev
```

This starts your Next.js app on `http://localhost:3000`

#### Terminal 2: WebSocket Server

```bash
node websocket-server.js
```

This starts the WebSocket server on `ws://localhost:3002`

### 5. Access the Application

- **Main App**: http://localhost:3000
- **Pod Feature**: http://localhost:3000/pod
- **Join Pod**: http://localhost:3000/pod/join/[invite-code]

## Database Schema

The app uses the following database models:

### User

- `id`: Unique identifier
- `clerkId`: Clerk authentication ID
- `email`: User email
- `name`: User display name
- `avatar`: User avatar

### ShoppingPod

- `id`: Unique identifier
- `name`: Pod name
- `inviteCode`: Unique invite code
- `ownerId`: Pod owner reference
- `createdAt`: Creation timestamp

### PodMember

- `id`: Unique identifier
- `podId`: Pod reference
- `userId`: User reference
- `isOwner`: Whether user is pod owner
- `joinedAt`: Join timestamp

### PodItem

- `id`: Unique identifier
- `podId`: Pod reference
- `productId`: Product identifier
- `name`: Item name
- `price`: Item price
- `quantity`: Item quantity
- `addedById`: User who added the item
- `addedAt`: Addition timestamp

## API Endpoints

### Pod Management

- `POST /api/pod/create` - Create a new pod
- `POST /api/pod/invite` - Generate invite codes and join pods
- `GET /api/pod/invite` - Validate invite codes

### Item Management

- `POST /api/pod/item` - Add item to pod
- `PUT /api/pod/item/[itemId]` - Update item quantity
- `DELETE /api/pod/item/[itemId]` - Remove item from pod

## WebSocket Events

The WebSocket server handles these real-time events:

- `member_joined` - New member joins the pod
- `item_added` - Item added to shopping list
- `item_updated` - Item quantity updated
- `item_removed` - Item removed from list
- `invite_sent` - Invite link shared

## Troubleshooting

### WebSocket Connection Issues

1. **Port already in use**: If you see "port 3002 already in use":

   ```bash
   # Find the process using port 3002
   netstat -ano | findstr :3002

   # Kill the process (replace PID with the actual process ID)
   taskkill /PID <PID> /F
   ```

2. **Infinite connection loop**: The WebSocket hook now prevents infinite reconnections by:
   - Only connecting when `podId` and `userId` are available
   - Tracking connection state to prevent duplicate connections
   - Proper cleanup on component unmount

### Database Issues

1. **Migration errors**: If you get migration errors:

   ```bash
   npx prisma migrate reset
   npx prisma migrate dev
   ```

2. **Prisma client not found**: Regenerate the client:
   ```bash
   npx prisma generate
   ```

### Development Tips

1. **Check WebSocket status**: Look for the "Live/Offline" indicator in the top-right corner of the pod page
2. **Database logs**: Check the console for database operation logs
3. **Real-time updates**: Open multiple browser tabs to test real-time collaboration

## File Structure

```
sparkathon/
├── app/
│   ├── (protected)/pod/          # Pod pages
│   ├── api/pod/                  # Pod API routes
│   ├── components/               # React components
│   ├── hooks/                   # Custom hooks
│   └── lib/                     # Utilities and services
├── prisma/                      # Database schema and migrations
├── websocket-server.js          # WebSocket server
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the WebSocket and database functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
