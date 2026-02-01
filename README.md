# Instagram Minimal Clone

A fully dynamic Instagram clone built with modern web technologies and real-time data synchronization.

## Features

- 🔐 **User Authentication** - Secure auth with Supabase
- 📸 **Posts & Stories** - Create and share photos/videos
- 💬 **Real-time Updates** - Live feed with Firebase Firestore
- ☁️ **Cloud Storage** - Media uploads via Cloudinary
- 🎥 **Reels** - Short-form video content
- 💬 **Messages** - Direct messaging between users
- 👥 **Social Features** - Follow/unfollow, likes, comments
- 🌓 **Dark Mode** - Full theme support
- 📱 **Responsive** - Mobile-first design
- ⚡ **Performance** - Optimized with lazy loading and caching

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Authentication**: Supabase Auth
- **Database**: Firebase Firestore
- **Storage**: Cloudinary
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project
- Cloudinary account
- Supabase project

### Installation

Follow these steps to run the project locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd insta-minimal

# Step 3: Install the necessary dependencies
npm install

# Step 4: Set up environment variables
# Create a .env file with:
# VITE_FIREBASE_API_KEY=your_firebase_key
# VITE_FIREBASE_AUTH_DOMAIN=your_domain
# VITE_FIREBASE_PROJECT_ID=your_project_id
# VITE_FIREBASE_STORAGE_BUCKET=your_bucket
# VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# VITE_FIREBASE_APP_ID=your_app_id
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_key

# Step 5: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.authorId;
    }
    match /stories/{storyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## Cloudinary Setup

1. Create account at https://cloudinary.com
2. Create an upload preset named "Instagram"
3. Set upload preset to "unsigned"
4. Configure allowed formats and file size limits

## Deployment

```sh
# Build for production
npm run build

# Deploy to Vercel
vercel deploy
```

## Project Structure

```
src/
├── components/     # React components
├── pages/          # Page components
├── stores/         # Zustand stores
├── services/       # Firebase & API services
├── lib/            # Utilities & config
├── hooks/          # Custom React hooks
└── types/          # TypeScript types
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or production.
