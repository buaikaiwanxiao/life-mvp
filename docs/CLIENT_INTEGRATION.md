# Client Integration - Rate Limited Uploads

## Quick Start

Add rate limiting to your upload flow by calling the 3 Cloud Functions in sequence.

## Installation

The Firebase SDK should already be installed. If not:

```bash
npm install firebase
```

## Usage Example

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const functions = getFunctions();
const storage = getStorage();

async function uploadWithRateLimit(file: File, uid: string) {
  try {
    // Step 1: Check upload status (optional, for UI feedback)
    const getUploadStatus = httpsCallable(functions, 'getUploadStatus');
    const statusResult = await getUploadStatus();
    const { remaining } = statusResult.data;

    if (remaining === 0) {
      alert('Daily upload limit reached (5 uploads per day)');
      return;
    }

    // Step 2: Reserve upload slot
    const reserveUploadSlot = httpsCallable(functions, 'reserveUploadSlot');
    const reserveResult = await reserveUploadSlot();
    const { reservationId } = reserveResult.data;

    // Step 3: Upload file to Storage
    const fileName = `${Date.now()}_${file.name}`;
    const storagePath = `uploads/${uid}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file);

    // Step 4: Finalize upload
    const finalizeUpload = httpsCallable(functions, 'finalizeUpload');
    await finalizeUpload({
      reservationId,
      fullPath: storageRef.fullPath,
      size: file.size,
    });

    console.log('Upload successful!');
    return { success: true, path: storagePath };

  } catch (error: any) {
    if (error.code === 'functions/resource-exhausted') {
      alert('Daily upload limit reached (5 uploads per day)');
    } else if (error.code === 'functions/unauthenticated') {
      alert('Please sign in to upload files');
    } else {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    }
    return { success: false, error };
  }
}
```

## With Progress Tracking

```typescript
import { uploadBytesResumable } from 'firebase/storage';

async function uploadWithProgress(file: File, uid: string, onProgress: (percent: number) => void) {
  try {
    // Reserve slot
    const reserveUploadSlot = httpsCallable(functions, 'reserveUploadSlot');
    const reserveResult = await reserveUploadSlot();
    const { reservationId } = reserveResult.data;

    // Upload with progress
    const storagePath = `uploads/${uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(percent);
        },
        (error) => reject(error),
        () => resolve()
      );
    });

    // Finalize
    const finalizeUpload = httpsCallable(functions, 'finalizeUpload');
    await finalizeUpload({
      reservationId,
      fullPath: storageRef.fullPath,
      size: file.size,
    });

    return { success: true };
  } catch (error: any) {
    if (error.code === 'functions/resource-exhausted') {
      throw new Error('Daily upload limit reached');
    }
    throw error;
  }
}
```

## React Component Example

```typescript
'use client';

import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

export default function UploadForm() {
  const [uploading, setUploading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const checkStatus = async () => {
    const functions = getFunctions();
    const getUploadStatus = httpsCallable(functions, 'getUploadStatus');
    const result = await getUploadStatus();
    setRemaining(result.data.remaining);
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const functions = getFunctions();
      const storage = getStorage();

      // Reserve slot
      const reserveUploadSlot = httpsCallable(functions, 'reserveUploadSlot');
      const reserveResult = await reserveUploadSlot();
      const { reservationId } = reserveResult.data;

      // Upload
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);

      // Finalize
      const finalizeUpload = httpsCallable(functions, 'finalizeUpload');
      await finalizeUpload({
        reservationId,
        fullPath: storageRef.fullPath,
        size: file.size,
      });

      alert('Upload successful!');
      await checkStatus(); // Refresh remaining count

    } catch (error: any) {
      if (error.code === 'functions/resource-exhausted') {
        alert('Daily limit reached (5 uploads per day)');
      } else {
        alert('Upload failed: ' + error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p>Uploads remaining today: {remaining ?? '...'}</p>
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        disabled={uploading || remaining === 0}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

## Error Handling

| Error Code | Description | Action |
|------------|-------------|--------|
| `functions/resource-exhausted` | Daily limit (5) reached | Show error, try tomorrow |
| `functions/unauthenticated` | User not signed in | Prompt sign in |
| `functions/not-found` | Reservation not found | Retry from step 2 |
| `functions/permission-denied` | Reservation ownership mismatch | Check authentication |
| `functions/failed-precondition` | Invalid reservation state | Retry from step 2 |

## Best Practices

1. **Always check status first** - Show remaining uploads to user
2. **Reserve before upload** - Don't upload if reservation fails
3. **Handle errors gracefully** - Show clear messages to users
4. **Finalize after upload** - Complete the flow even on errors
5. **Show progress** - Use resumable uploads for large files

## Security Notes

- Users can only access their own reservations
- Rate limits enforced server-side (cannot be bypassed)
- Functions require authentication
- dateKey validation prevents manipulation

## Testing

```typescript
// Check daily status
const getUploadStatus = httpsCallable(functions, 'getUploadStatus');
const status = await getUploadStatus();
console.log(status.data);
// { count: 2, limit: 5, remaining: 3, dateKey: '2026-01-06' }

// Test limit reached
for (let i = 0; i < 6; i++) {
  try {
    await reserveUploadSlot();
    console.log(`Reservation ${i + 1} succeeded`);
  } catch (error) {
    console.log(`Reservation ${i + 1} failed:`, error.code);
    // functions/resource-exhausted
  }
}
```

## Migration from Direct Uploads

If you're currently uploading directly to Storage without rate limiting:

### Before:
```typescript
const storageRef = ref(storage, 'uploads/file.pdf');
await uploadBytes(storageRef, file);
```

### After:
```typescript
// Add reservation step
const reserveUploadSlot = httpsCallable(functions, 'reserveUploadSlot');
const { reservationId } = (await reserveUploadSlot()).data;

// Upload as before
const storageRef = ref(storage, 'uploads/file.pdf');
await uploadBytes(storageRef, file);

// Add finalization step
const finalizeUpload = httpsCallable(functions, 'finalizeUpload');
await finalizeUpload({
  reservationId,
  fullPath: storageRef.fullPath,
  size: file.size,
});
```

## FAQ

**Q: What happens if finalization fails?**
A: The reservation remains in 'reserved' state but the upload still completed. The count was already incremented, so the user's daily limit is consumed.

**Q: Can users bypass the limit?**
A: No, the limit is enforced server-side via Firestore transactions. Client-side code cannot bypass it.

**Q: When does the daily count reset?**
A: Automatically at midnight UTC when the dateKey changes (YYYY-MM-DD format).

**Q: What if a user creates multiple accounts?**
A: Each Firebase Auth UID gets 5 uploads per day. Anonymous Auth UIDs persist in browser storage.

**Q: Can I change the limit from 5?**
A: Yes, edit `functions/src/index.ts` and change `const limit = 5;` to your desired value.
