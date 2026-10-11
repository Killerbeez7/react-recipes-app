/**
 * One-off migration: Realtime Database export (JSON) -> Firestore.
 *
 * Usage:
 *   node scripts/migrate-to-firestore.js [export.json]            # dry run (default)
 *   node scripts/migrate-to-firestore.js [export.json] --commit   # write to Firestore
 *
 * Credentials: point GOOGLE_APPLICATION_CREDENTIALS at a service account key
 * (Firebase console > Project settings > Service accounts > Generate new private key).
 *
 * Firestore layout produced:
 *   recipes/{rtdbKey}                       recipe fields (normalised types)
 *   recipes/{rtdbKey}/comments/{rtdbKey}    one doc per comment
 *   users/{uid}                             profile + savedRecipes array
 *
 * IDs are kept from the RTDB so existing links keep working. Recipes and
 * comments are overwritten (the RTDB is the source of truth); users are
 * merged so fields that only exist in Firestore (displayName, extra saved
 * recipes...) survive. Safe to re-run.
 */
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const PROJECT_ID = "eat-and-amare-f0f08";
const BATCH_LIMIT = 400; // Firestore allows 500 writes per batch

const args = process.argv.slice(2);
const commit = args.includes("--commit");
const exportPath = path.resolve(
    args.find((a) => !a.startsWith("--")) ||
        path.join(__dirname, "rtdb-export.json")
);

// ---------------------------------------------------------------- helpers

// RTDB push IDs encode their creation time (ms) in the first 8 characters
const PUSH_CHARS =
    "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
const pushIdToDate = (id) => {
    if (typeof id !== "string" || id.length !== 20) return null;
    let ms = 0;
    for (const char of id.slice(0, 8)) {
        const value = PUSH_CHARS.indexOf(char);
        if (value === -1) return null;
        ms = ms * 64 + value;
    }
    return new Date(ms);
};

const toTimestamp = (value, fallbackDate = null) => {
    const date = value ? new Date(value) : fallbackDate;
    return date && !isNaN(date)
        ? admin.firestore.Timestamp.fromDate(date)
        : null;
};

const toNumber = (value) => {
    const n = Number(String(value ?? "").trim());
    return Number.isFinite(n) && n > 0 ? n : null;
};

const toCategories = (recipe) => {
    const raw = recipe.categories ?? recipe.category ?? [];
    const list = Array.isArray(raw) ? raw : String(raw).split(",");
    return [...new Set(list.map((c) => String(c).trim()).filter(Boolean))];
};

const withoutNulls = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null));

// ---------------------------------------------------------------- transform

const transform = ({ recipes = {}, users = {} }) => {
    const warnings = [];
    const recipeDocs = [];
    const commentDocs = [];
    const userDocs = [];

    for (const [id, r] of Object.entries(recipes)) {
        const likes = r.likes && typeof r.likes === "object" ? r.likes : {};
        if (typeof r.likes !== "object") {
            warnings.push(
                `recipe ${id}: likes was ${JSON.stringify(r.likes)} – reset to {}`
            );
        }
        const ratings =
            r.ratings && typeof r.ratings === "object" ? r.ratings : {};
        const ratingValues = Object.values(ratings).map(Number);
        const comments = Object.entries(r.comments || {});
        const author = users[r.authorId];
        if (!author)
            warnings.push(
                `recipe ${id}: author ${r.authorId} has no user record`
            );

        recipeDocs.push({
            id,
            data: withoutNulls({
                title: (r.title || "").trim(),
                description: (r.description || "").trim(),
                imageUrl: r.imageUrl || "",
                cuisine: r.cuisine || "",
                difficulty: r.difficulty || "Easy",
                timeToCook: toNumber(r.timeToCook),
                servings: toNumber(r.servings),
                ingredients: r.ingredients || "",
                steps: r.steps || "",
                categories: toCategories(r),
                authorId: r.authorId || "",
                authorName: r.authorName || author?.username || "",
                likes,
                likeCount: Object.keys(likes).length,
                ratings,
                ratingCount: ratingValues.length,
                averageRating: ratingValues.length
                    ? Number(
                          (
                              ratingValues.reduce((a, b) => a + b, 0) /
                              ratingValues.length
                          ).toFixed(2)
                      )
                    : 0,
                commentCount: comments.length,
                createdAt: toTimestamp(r.createdAt, pushIdToDate(id)),
            }),
        });

        for (const [commentId, c] of comments) {
            commentDocs.push({
                recipeId: id,
                id: commentId,
                data: withoutNulls({
                    text: c.text || "",
                    userId: c.userId || "",
                    username: c.username || "Anonymous",
                    userPhoto: c.userPhoto || "",
                    createdAt: toTimestamp(
                        c.createdAt,
                        pushIdToDate(commentId)
                    ),
                    updatedAt: toTimestamp(c.updatedAt),
                }),
            });
        }
    }

    for (const [uid, u] of Object.entries(users)) {
        const saved = Object.keys(u.savedRecipes || {}).filter((rid) => {
            if (recipes[rid]) return true;
            warnings.push(
                `user ${uid}: dropped saved recipe ${rid} (no longer exists)`
            );
            return false;
        });

        userDocs.push({
            id: uid,
            data: withoutNulls({
                // Users are merged, so only write values the RTDB actually has
                username: u.username || null,
                email: u.email || null,
                profilePicture: u.profilePicture || null,
                bio: u.bio || null,
                firstName: u.firstName || null,
                lastName: u.lastName || null,
                savedRecipes: saved.length
                    ? admin.firestore.FieldValue.arrayUnion(...saved)
                    : null,
                createdAt: toTimestamp(u.createdAt),
            }),
        });
    }

    return { recipeDocs, commentDocs, userDocs, warnings };
};

// ---------------------------------------------------------------- write

const writeAll = async (db, { recipeDocs, commentDocs, userDocs }) => {
    const writes = [
        ...recipeDocs.map((d) => [
            db.collection("recipes").doc(d.id),
            d.data,
            {},
        ]),
        ...commentDocs.map((d) => [
            db
                .collection("recipes")
                .doc(d.recipeId)
                .collection("comments")
                .doc(d.id),
            d.data,
            {},
        ]),
        ...userDocs.map((d) => [
            db.collection("users").doc(d.id),
            d.data,
            { merge: true },
        ]),
    ];

    for (let i = 0; i < writes.length; i += BATCH_LIMIT) {
        const batch = db.batch();
        writes
            .slice(i, i + BATCH_LIMIT)
            .forEach(([ref, data, options]) => batch.set(ref, data, options));
        await batch.commit();
        console.log(
            `  committed ${Math.min(i + BATCH_LIMIT, writes.length)}/${writes.length} writes`
        );
    }
};

// ---------------------------------------------------------------- main

const main = async () => {
    const data = JSON.parse(fs.readFileSync(exportPath, "utf8"));
    const result = transform(data.recipes ? data : { recipes: data });

    console.log(`Source: ${exportPath}`);
    console.log(
        `Prepared ${result.recipeDocs.length} recipes, ${result.commentDocs.length} comments, ${result.userDocs.length} users.`
    );
    result.warnings.forEach((w) => console.warn(`  ! ${w}`));

    if (!commit) {
        const sample = result.recipeDocs[0];
        if (sample) {
            console.log(`\nSample recipe (${sample.id}):`);
            console.log(JSON.stringify(sample.data, null, 2));
        }
        console.log(
            "\nDry run only – nothing written. Re-run with --commit to write to Firestore."
        );
        return;
    }

    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: PROJECT_ID,
    });
    console.log(`\nWriting to Firestore project "${PROJECT_ID}"...`);
    await writeAll(admin.firestore(), result);
    console.log("Done.");
};

main().catch((error) => {
    console.error("Migration failed:", error.message);
    process.exit(1);
});
