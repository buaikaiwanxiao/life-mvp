import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

function getDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

interface GetUploadStatusResponse {
  count: number;
  limit: number;
  remaining: number;
  dateKey: string;
}

export const getUploadStatus = functions.https.onCall(
  async (data, context): Promise<GetUploadStatusResponse> => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const uid = context.auth.uid;
    const dateKey = getDateKey();
    const docId = `${uid}_${dateKey}`;

    const docRef = db.collection('dailyUploadCounts').doc(docId);
    const doc = await docRef.get();

    let count = 0;

    if (!doc.exists) {
      await docRef.set({
        uid,
        dateKey,
        count: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      count = doc.data()?.count || 0;
    }

    const limit = 5;
    const remaining = Math.max(0, limit - count);

    return {
      count,
      limit,
      remaining,
      dateKey,
    };
  }
);

interface ReserveUploadSlotResponse {
  reservationId: string;
  dateKey: string;
  count: number;
  limit: number;
}

export const reserveUploadSlot = functions.https.onCall(
  async (data, context): Promise<ReserveUploadSlotResponse> => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const uid = context.auth.uid;
    const dateKey = getDateKey();
    const docId = `${uid}_${dateKey}`;
    const limit = 5;

    const result = await db.runTransaction(async (transaction) => {
      const countDocRef = db.collection('dailyUploadCounts').doc(docId);
      const countDoc = await transaction.get(countDocRef);

      let currentCount = 0;

      if (countDoc.exists) {
        currentCount = countDoc.data()?.count || 0;
      }

      if (currentCount >= limit) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          `Daily upload limit (${limit}) reached`
        );
      }

      const newCount = currentCount + 1;

      if (countDoc.exists) {
        transaction.update(countDocRef, {
          count: newCount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        transaction.set(countDocRef, {
          uid,
          dateKey,
          count: newCount,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      const reservationRef = db.collection('uploadReservations').doc();
      transaction.set(reservationRef, {
        uid,
        dateKey,
        status: 'reserved',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        reservationId: reservationRef.id,
        count: newCount,
      };
    });

    return {
      reservationId: result.reservationId,
      dateKey,
      count: result.count,
      limit,
    };
  }
);

interface FinalizeUploadData {
  reservationId: string;
  fullPath: string;
  size: number;
}

interface FinalizeUploadResponse {
  success: boolean;
  reservationId: string;
}

export const finalizeUpload = functions.https.onCall(
  async (data: FinalizeUploadData, context): Promise<FinalizeUploadResponse> => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const { reservationId, fullPath, size } = data;

    if (!reservationId || !fullPath || typeof size !== 'number') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields: reservationId, fullPath, size'
      );
    }

    const uid = context.auth.uid;
    const dateKey = getDateKey();

    const reservationRef = db.collection('uploadReservations').doc(reservationId);
    const reservationDoc = await reservationRef.get();

    if (!reservationDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Reservation not found'
      );
    }

    const reservation = reservationDoc.data();

    if (reservation?.uid !== uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Reservation does not belong to authenticated user'
      );
    }

    if (reservation?.dateKey !== dateKey) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Reservation dateKey does not match current date'
      );
    }

    if (reservation?.status !== 'reserved') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        `Reservation status is ${reservation?.status}, expected 'reserved'`
      );
    }

    await reservationRef.update({
      status: 'uploaded',
      fullPath,
      size,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      reservationId,
    };
  }
);
