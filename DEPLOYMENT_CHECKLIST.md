# Firebase Cloud Functions Deployment Checklist

## Prerequisites
- [ ] Firebase project created at console.firebase.google.com
- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)

## Initial Setup

### 1. Firebase CLI Login
```bash
firebase login
```

### 2. Configure Project ID
Edit `.firebaserc` and replace `"your-project-id"` with your actual Firebase project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

Verify:
```bash
firebase projects:list
firebase use your-actual-project-id
```

### 3. Install Function Dependencies
```bash
cd functions
npm install
cd ..
```

Expected output:
```
added 200+ packages
```

### 4. Build Functions
```bash
npm run functions:build
```

Expected output:
```
functions/lib/index.js created
```

## Deployment

### 5. Deploy Functions
```bash
npm run functions:deploy
```

Or directly:
```bash
firebase deploy --only functions
```

Expected output:
```
✔ functions[getUploadStatus(us-central1)] Successful create operation.
✔ functions[reserveUploadSlot(us-central1)] Successful create operation.
✔ functions[finalizeUpload(us-central1)] Successful create operation.
```

### 6. Verify Deployment
Check Firebase Console → Functions:
- [ ] `getUploadStatus` deployed
- [ ] `reserveUploadSlot` deployed
- [ ] `finalizeUpload` deployed

All should show status: **Active**

## Firestore Setup

### 7. Enable Firestore Database
Firebase Console → Firestore Database → Create Database
- Choose production mode
- Select region (us-central1 recommended)

### 8. Configure Security Rules
Firebase Console → Firestore Database → Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Daily upload counts - users can read their own
    match /dailyUploadCounts/{docId} {
      allow read: if request.auth != null &&
                     docId.matches(request.auth.uid + '_.*');
      allow write: if false; // Only Cloud Functions can write
    }

    // Upload reservations - users can read their own
    match /uploadReservations/{reservationId} {
      allow read: if request.auth != null &&
                     resource.data.uid == request.auth.uid;
      allow write: if false; // Only Cloud Functions can write
    }
  }
}
```

Click **Publish**

### 9. Test Firestore Connection
Firebase Console → Firestore Database → Data
Collections should appear after first function call:
- `dailyUploadCounts`
- `uploadReservations`

## Client Integration

### 10. Update Client Code
See `docs/CLIENT_INTEGRATION.md` for examples.

Minimal integration:
```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

// Reserve slot before upload
const reserveUploadSlot = httpsCallable(functions, 'reserveUploadSlot');
const result = await reserveUploadSlot();
const { reservationId } = result.data;
```

### 11. Test in Browser
1. Open your app
2. Sign in (Anonymous Auth)
3. Try uploading a file
4. Check browser console for function calls
5. Verify Firestore collections populated

## Testing

### 12. Test Rate Limiting
```typescript
// Test status check
const getUploadStatus = httpsCallable(functions, 'getUploadStatus');
const status = await getUploadStatus();
console.log(status.data);
// Expected: { count: 0, limit: 5, remaining: 5, dateKey: '2026-01-06' }

// Test reservation
const reserveUploadSlot = httpsCallable(functions, 'reserveUploadSlot');
const result = await reserveUploadSlot();
console.log(result.data);
// Expected: { reservationId: '...', dateKey: '2026-01-06', count: 1, limit: 5 }

// Test limit (try 6 times)
for (let i = 0; i < 6; i++) {
  try {
    await reserveUploadSlot();
    console.log(`Upload ${i + 1}: Success`);
  } catch (error) {
    console.log(`Upload ${i + 1}: ${error.code}`);
    // Expected on 6th: functions/resource-exhausted
  }
}
```

### 13. Check Function Logs
```bash
firebase functions:log
```

Or Firebase Console → Functions → Logs

Look for:
- Function invocations
- Error messages
- Performance metrics

## Monitoring

### 14. Set Up Monitoring (Optional)
Firebase Console → Functions → Dashboard

Monitor:
- Invocations per day
- Errors per day
- Execution time
- Active instances

Free tier limits:
- 2M invocations/month
- 400K GB-seconds/month
- 200K CPU-seconds/month

## Troubleshooting

### Common Issues

#### Functions not deploying
```bash
# Check project
firebase projects:list

# Set project
firebase use your-project-id

# Redeploy
firebase deploy --only functions --force
```

#### TypeScript errors
```bash
cd functions
npm install
npm run build
```

#### Authentication errors
Ensure Firebase Anonymous Auth is enabled:
Firebase Console → Authentication → Sign-in method → Anonymous → Enable

#### Permission denied
Check Firestore security rules are properly configured (Step 8)

#### Function timeout
Default timeout: 60s
If needed, increase in `functions/src/index.ts`:
```typescript
export const myFunction = functions
  .runWith({ timeoutSeconds: 300 })
  .https.onCall(...)
```

## Rollback Plan

If you need to rollback:

1. Delete deployed functions:
```bash
firebase functions:delete getUploadStatus
firebase functions:delete reserveUploadSlot
firebase functions:delete finalizeUpload
```

2. Restore previous client code (remove function calls)

3. Redeploy:
```bash
firebase deploy --only functions
```

## Cost Estimation

Free tier includes:
- 2M function invocations/month
- Each upload flow = 2-3 invocations
- ~600-1000 uploads/month within free tier

Monitor usage:
Firebase Console → Usage and billing

## Security Checklist

- [ ] Firestore security rules deployed
- [ ] Functions require authentication
- [ ] Rate limiting enforced server-side
- [ ] Reservation ownership validated
- [ ] No sensitive data in function logs
- [ ] CORS configured (if needed for web)

## Performance Checklist

- [ ] Functions deploy in < 2 minutes
- [ ] Cold start < 3 seconds
- [ ] Warm invocation < 500ms
- [ ] Firestore queries indexed
- [ ] No unnecessary function calls

## Documentation

Created files:
- `functions/src/index.ts` - Function implementation
- `docs/FIREBASE_FUNCTIONS.md` - Complete documentation
- `docs/CLIENT_INTEGRATION.md` - Client usage examples
- `FIREBASE_FUNCTIONS_SUMMARY.md` - Implementation summary
- `DEPLOYMENT_CHECKLIST.md` - This file

## Next Steps

After deployment:
1. Test all 3 functions in production
2. Monitor function logs for errors
3. Update client code with production function calls
4. Set up error tracking (Sentry, etc.)
5. Configure alerts for function failures
6. Document internal procedures

## Support

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

## Completion

Mark when done:
- [ ] Functions deployed successfully
- [ ] Firestore rules configured
- [ ] Client integration tested
- [ ] Rate limiting verified (6th upload fails)
- [ ] Logs checked for errors
- [ ] Monitoring dashboard reviewed
- [ ] Team notified of deployment

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Project ID:** _____________
**Region:** us-central1 (or _____________)
