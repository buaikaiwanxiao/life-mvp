# Firebase Cloud Functions - Upload Rate Limiting

## Overview

This project includes 3 Firebase Cloud Functions (v2) that implement upload rate limiting (5 uploads per user per day).

## Functions

### 1. `getUploadStatus`
**Purpose:** Check current upload status for the authenticated user

**Returns:**
```typescript
{
  count: number;      // Current uploads today
  limit: number;      // Daily limit (5)
  remaining: number;  // Uploads remaining today
  dateKey: string;    // Date key (YYYY-MM-DD)
}
```

### 2. `reserveUploadSlot`
**Purpose:** Reserve an upload slot (must be called before uploading)

**Behavior:**
- Uses Firestore transaction to ensure atomic increment
- Throws `resource-exhausted` error if limit (5) reached
- Creates reservation record in `uploadReservations` collection
- Increments `dailyUploadCounts/{uid}_{dateKey}` count

**Returns:**
```typescript
{
  reservationId: string;  // Use this for finalizeUpload
  dateKey: string;
  count: number;
  limit: number;
}
```

### 3. `finalizeUpload`
**Purpose:** Mark reservation as uploaded after file upload completes

**Parameters:**
```typescript
{
  reservationId: string;  // From reserveUploadSlot
  fullPath: string;       // Storage path
  size: number;           // File size in bytes
}
```

**Validation:**
- Verifies reservation belongs to authenticated user
- Checks dateKey matches current date
- Ensures reservation status is 'reserved'

**Returns:**
```typescript
{
  success: boolean;
  reservationId: string;
}
```

## Firestore Collections

### `dailyUploadCounts/{uid}_{dateKey}`
```typescript
{
  uid: string;
  dateKey: string;        // YYYY-MM-DD
  count: number;          // 0-5
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

### `uploadReservations/{reservationId}`
```typescript
{
  uid: string;
  dateKey: string;
  status: 'reserved' | 'uploaded';
  createdAt: Timestamp;
  fullPath?: string;      // Added by finalizeUpload
  size?: number;          // Added by finalizeUpload
  uploadedAt?: Timestamp; // Added by finalizeUpload
}
```

## Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Project
```bash
# Update .firebaserc with your project ID
# Edit .firebaserc and replace "your-project-id" with actual project ID
```

### 4. Install Function Dependencies
```bash
cd functions
npm install
cd ..
```

### 5. Build Functions
```bash
npm run functions:build
```

### 6. Deploy Functions
```bash
npm run functions:deploy
```

Or deploy directly:
```bash
firebase deploy --only functions
```

## Local Development

### Run Functions Emulator
```bash
npm run functions:serve
```

This starts the Firebase Emulator on http://localhost:5001

## Client Integration Example

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

// 1. Check upload status
const getUploadStatus = httpsCallable(functions, 'getUploadStatus');
const statusResult = await getUploadStatus();
console.log(statusResult.data);
// { count: 2, limit: 5, remaining: 3, dateKey: '2026-01-06' }

// 2. Reserve slot before upload
const reserveUploadSlot = httpsCallable(functions, 'reserveUploadSlot');
try {
  const reserveResult = await reserveUploadSlot();
  const { reservationId } = reserveResult.data;

  // 3. Upload file to Storage
  const storageRef = ref(storage, `uploads/${uid}/${fileName}`);
  await uploadBytes(storageRef, file);
  const fullPath = storageRef.fullPath;

  // 4. Finalize upload
  const finalizeUpload = httpsCallable(functions, 'finalizeUpload');
  await finalizeUpload({
    reservationId,
    fullPath,
    size: file.size
  });

} catch (error: any) {
  if (error.code === 'functions/resource-exhausted') {
    alert('Daily upload limit reached (5 uploads per day)');
  }
}
```

## Security Rules

Functions are automatically secured:
- All 3 functions require authentication (`context.auth`)
- `finalizeUpload` validates reservation ownership
- Rate limiting enforced via Firestore transactions

## Firestore Security Rules

Add these rules to allow functions to write to collections:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read their own upload counts
    match /dailyUploadCounts/{docId} {
      allow read: if request.auth != null &&
                     docId.matches(request.auth.uid + '_.*');
      allow write: if false; // Only functions can write
    }

    // Users can read their own reservations
    match /uploadReservations/{reservationId} {
      allow read: if request.auth != null &&
                     resource.data.uid == request.auth.uid;
      allow write: if false; // Only functions can write
    }
  }
}
```

## Deployment Commands

| Command | Description |
|---------|-------------|
| `npm run functions:build` | Build TypeScript functions |
| `npm run functions:deploy` | Deploy to Firebase |
| `npm run functions:serve` | Run local emulator |
| `firebase deploy --only functions` | Direct deployment |
| `firebase functions:log` | View function logs |

## Troubleshooting

### Functions not deploying
```bash
# Check Firebase project
firebase projects:list

# Set correct project
firebase use your-project-id
```

### TypeScript errors
```bash
cd functions
npm install
npm run build
```

### Authentication errors
Ensure user is signed in (Anonymous Auth or other method) before calling functions.

## Cost Considerations

- Functions are free tier: 2M invocations/month
- Each upload uses 2-3 function calls (status check + reserve + finalize)
- ~600-1000 uploads per month within free tier
