// -----------------------------------------------------------------------------
// سكريبت ترحيل بيانات Firestore - يُستخدم لمرة واحدة فقط
// -----------------------------------------------------------------------------
// الهدف: نقل الحقول الحساسة من المجموعات العامة إلى مجموعات خاصة جديدة.
// -----------------------------------------------------------------------------

// استيراد مكتبة Firebase Admin
const admin = require('firebase-admin');

// --- الإعداد ---
// قم بتحميل مفتاح حساب الخدمة الخاص بك من لوحة تحكم Firebase
// وأعد تسميته إلى "serviceAccountKey.json" وضعه في نفس المجلد
const serviceAccount = require('./serviceAccountKey.json');

// تهيئة تطبيق Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// الحصول على مرجع لقاعدة البيانات
const db = admin.firestore();

// إعدادات: تحديد عدد المستندات التي سيتم معالجتها في كل دفعة
const BATCH_SIZE = 50;

/**
 * دالة لترحيل بيانات الفرق القديمة
 */
async function migrateTeams() {
  console.log('--- بدء ترحيل بيانات الفرق (teams) ---');
  const teamsRef = db.collection('teams');
  const snapshot = await teamsRef.get();

  if (snapshot.empty) {
    console.log('لا توجد فرق لترحيلها.');
    return;
  }

  let batch = db.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    const teamData = doc.data();

    // تحقق مما إذا كان المستند يحتوي على البيانات القديمة (لم يتم ترحيله بعد)
    if (teamData.captainNationalId && teamData.captainUid) {
      const teamId = doc.id;
      console.log(`[Teams] جاري ترحيل الفريق: ${teamData.teamName || teamId}`);

      const privateData = {
        captainNationalId: teamData.captainNationalId,
        captainUid: teamData.captainUid,
      };

      // 1. إنشاء مستند جديد في المجموعة الخاصة
      const privateDocRef = db.collection('privateTeamData').doc(teamId);
      batch.set(privateDocRef, privateData);

      // 2. تحديث المستند العام لحذف الحقول الحساسة
      const publicDocRef = teamsRef.doc(teamId);
      batch.update(publicDocRef, {
        captainNationalId: admin.firestore.FieldValue.delete(),
        captainUid: admin.firestore.FieldValue.delete(),
      });

      count++;
      // تنفيذ الدفعة عند الوصول إلى الحد الأقصى أو عند الانتهاء
      if (count % BATCH_SIZE === 0 || count === snapshot.size) {
        await batch.commit();
        console.log(`... تم تنفيذ دفعة من ${count} عملية.`);
        batch = db.batch(); // إعادة تهيئة الدفعة
      }
    } else {
        console.log(`[Teams] تخطي الفريق ${doc.id} (تم ترحيله مسبقًا أو لا يحتوي على بيانات حساسة)`);
    }
  }

  if (count > 0) {
    console.log(`✅ اكتمل ترحيل ${count} فريق بنجاح.`);
  } else {
    console.log('لا توجد فرق جديدة تحتاج إلى ترحيل.');
  }
}

/**
 * دالة لترحيل بيانات اللاعبين الأحرار القديمة
 */
async function migrateFreePlayers() {
  console.log('\n--- بدء ترحيل بيانات اللاعبين الأحرار (free_players) ---');
  const playersRef = db.collection('free_players');
  const snapshot = await playersRef.get();

  if (snapshot.empty) {
    console.log('لا يوجد لاعبون أحرار لترحيلهم.');
    return;
  }

  let batch = db.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    const playerData = doc.data();

    // تحقق مما إذا كان المستند يحتوي على البيانات القديمة
    if (playerData.nationalId && playerData.playerUid) {
      const playerId = doc.id;
      console.log(`[Free Players] جاري ترحيل اللاعب: ${playerData.name || playerId}`);

      const privateData = {
        nationalId: playerData.nationalId,
        playerUid: playerData.playerUid,
      };

      // 1. إنشاء مستند جديد في المجموعة الخاصة
      const privateDocRef = db.collection('privateFreePlayerData').doc(playerId);
      batch.set(privateDocRef, privateData);

      // 2. تحديث المستند العام لحذف الحقول الحساسة
      const publicDocRef = playersRef.doc(playerId);
      batch.update(publicDocRef, {
        nationalId: admin.firestore.FieldValue.delete(),
        playerUid: admin.firestore.FieldValue.delete(),
      });
      
      count++;
      if (count % BATCH_SIZE === 0 || count === snapshot.size) {
        await batch.commit();
        console.log(`... تم تنفيذ دفعة من ${count} عملية.`);
        batch = db.batch();
      }
    } else {
        console.log(`[Free Players] تخطي اللاعب ${doc.id} (تم ترحيله مسبقًا أو لا يحتوي على بيانات حساسة)`);
    }
  }

  if (count > 0) {
    console.log(`✅ اكتمل ترحيل ${count} لاعب حر بنجاح.`);
  } else {
    console.log('لا يوجد لاعبون أحرار جدد يحتاجون إلى ترحيل.');
  }
}

/**
 * الدالة الرئيسية لتشغيل السكريبت
 */
async function main() {
  try {
    await migrateTeams();
    await migrateFreePlayers();
    console.log('\n🎉 اكتملت عملية الترحيل بنجاح! 🎉');
  } catch (error) {
    console.error('❌ حدث خطأ فادح أثناء عملية الترحيل:', error);
  }
}

// بدء التنفيذ
main();
