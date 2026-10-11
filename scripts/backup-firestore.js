/**
 * Dumps the top-level Firestore collections (and their subcollections) to a
 * JSON file so a migration can be reviewed or rolled back.
 *
 *   node scripts/backup-firestore.js [out.json]
 */
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const out = path.resolve(
    process.argv[2] ||
        path.join(__dirname, `firestore-backup-${Date.now()}.json`)
);

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "eat-and-amare-f0f08",
});
const db = admin.firestore();

const dumpCollection = async (ref) => {
    const result = {};
    for (const doc of (await ref.get()).docs) {
        const entry = { data: doc.data() };
        for (const sub of await doc.ref.listCollections()) {
            entry[sub.id] = await dumpCollection(sub);
        }
        result[doc.id] = entry;
    }
    return result;
};

(async () => {
    const backup = {};
    for (const collection of await db.listCollections()) {
        backup[collection.id] = await dumpCollection(collection);
    }
    fs.writeFileSync(out, JSON.stringify(backup, null, 2));
    console.log(`Backed up ${Object.keys(backup).join(", ")} to ${out}`);
})().catch((error) => {
    console.error("Backup failed:", error.message);
    process.exit(1);
});
