/**
 * Removes the `email` field from Firestore user profiles. Profiles are
 * publicly readable (author names/avatars), while emails already live in
 * Firebase Auth. Dry run by default.
 *
 *   node scripts/remove-user-emails.js            # list affected users
 *   node scripts/remove-user-emails.js --commit   # remove the field
 */
const admin = require("firebase-admin");

const commit = process.argv.includes("--commit");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "eat-and-amare-f0f08",
});
const db = admin.firestore();

(async () => {
    const users = await db.collection("users").get();
    const withEmail = users.docs.filter((d) => d.get("email") !== undefined);
    console.log(
        `${withEmail.length} of ${users.size} user profiles contain an email field.`
    );

    if (!commit) {
        console.log("Dry run only – re-run with --commit to remove it.");
        return;
    }

    const batch = db.batch();
    withEmail.forEach((d) =>
        batch.update(d.ref, { email: admin.firestore.FieldValue.delete() })
    );
    await batch.commit();
    console.log(`Removed email from ${withEmail.length} profiles.`);
})().catch((e) => {
    console.error("Failed:", e.message);
    process.exit(1);
});
