# Via You — Travel Bucket List App

A mobile travel app built with React Native (Expo) that lets you build and track your travel bucket list, visualise progress, and explore locations on a map.

---

## Features

- Google Sign-In via Clerk authentication
- Add travel bucket list items with title, description, location, category, and planned date
- Mark items as completed
- View locations on an interactive map
- Dashboard with stats and a bar chart overview of completed vs pending items
- Profile page with user info

---

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | React Native + Expo (Expo Router) |
| Language | TypeScript |
| Backend / Database | Convex |
| Authentication | Clerk (Google OAuth) |
| Maps | react-native-maps |
| Navigation | Expo Router (file-based) |

---

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo`)
- A [Convex](https://convex.dev) account
- A [Clerk](https://clerk.com) account with Google OAuth enabled
- Expo Go app on your phone, or an iOS/Android simulator

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/annie987/travelapp.git
cd travelapp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_CONVEX_URL=your_convex_deployment_url
CLERK_FRONTEND_API_URL=your_clerk_frontend_api_url
```

### 4. Set up Convex
```bash
npx convex dev
```
This will deploy your schema and functions to Convex and keep them in sync while developing.

### 5. Run the app
```bash
npm start
```
Then scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android.

---

## Project Structure

```
travelapp/
├── app/
│   ├── (auth)/
│   │   └── sign-in.tsx        # Google sign-in screen
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard
│   │   ├── bucketlist.tsx     # Bucket list
│   │   ├── map.tsx            # Map view
│   │   └── profile.tsx        # User profile
│   ├── components/
│   │   └── InitialLayout.tsx  # Auth routing logic
│   └── _layout.tsx            # Root layout
├── convex/
│   ├── schema.ts              # Database schema
│   ├── users.ts               # User functions
│   ├── bucketlist.ts          # Bucket list functions
│   └── auth.config.ts         # Clerk auth config
├── providers/
│   └── ClerkAndConvexProvider.tsx
├── constants/
│   └── theme.ts
└── styles/
    └── auth.styles.ts
```

---

## Future Improvements

- Photo uploads for bucket list items
- Share bucket list with friends
- Filter and search items by category
- Push notifications for upcoming planned dates
- Offline support
