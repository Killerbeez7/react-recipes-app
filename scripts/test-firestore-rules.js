/**
 * Checks firestore.rules against example requests using the Firebase Rules
 * API test endpoint – nothing is deployed.
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=<service-account.json> node scripts/test-firestore-rules.js
 */
const fs = require("fs");
const path = require("path");
const { GoogleAuth } = require("google-auth-library");

const PROJECT = "eat-and-amare-f0f08";
const DOCS = "/databases/(default)/documents";
const source = fs.readFileSync(
    path.join(__dirname, "..", "firestore.rules"),
    "utf8"
);

const recipe = {
    authorId: "alice",
    title: "Soup",
    likes: { bob: true },
    likeCount: 1,
    ratings: { bob: 4 },
    ratingCount: 1,
    averageRating: 4,
    commentCount: 2,
};
const recipePath = `${DOCS}/recipes/r1`;
const commentPath = `${DOCS}/recipes/r1/comments/c1`;
const comment = { userId: "bob", text: "Nice!", username: "Bob" };
const recipeLookup = [
    {
        function: "get",
        args: [{ exactValue: recipePath }],
        result: { value: { data: recipe } },
    },
];

// [description, expectation, uid|null, method, path, existing data, new data]
const cases = [
    ["anyone reads a recipe", "ALLOW", null, "get", recipePath, recipe],
    [
        "anyone reads comments",
        "ALLOW",
        null,
        "list",
        `${DOCS}/recipes/r1/comments`,
    ],
    [
        "anyone reads a profile",
        "ALLOW",
        null,
        "get",
        `${DOCS}/users/alice`,
        { username: "Alice" },
    ],
    [
        "signed-out user can't create a recipe",
        "DENY",
        null,
        "create",
        recipePath,
        null,
        { authorId: "alice", title: "x" },
    ],
    [
        "user creates own recipe",
        "ALLOW",
        "alice",
        "create",
        recipePath,
        null,
        {
            authorId: "alice",
            title: "Soup",
            likes: {},
            likeCount: 0,
            ratings: {},
            commentCount: 0,
        },
    ],
    [
        "can't create a recipe as someone else",
        "DENY",
        "bob",
        "create",
        recipePath,
        null,
        { authorId: "alice", title: "Soup" },
    ],
    [
        "can't create a recipe with fake likes",
        "DENY",
        "alice",
        "create",
        recipePath,
        null,
        { authorId: "alice", title: "Soup", likeCount: 99 },
    ],
    [
        "author edits content",
        "ALLOW",
        "alice",
        "update",
        recipePath,
        recipe,
        { ...recipe, title: "Better soup" },
    ],
    [
        "non-author can't edit content",
        "DENY",
        "bob",
        "update",
        recipePath,
        recipe,
        { ...recipe, title: "Hacked" },
    ],
    [
        "author can't change authorId",
        "DENY",
        "alice",
        "update",
        recipePath,
        recipe,
        { ...recipe, authorId: "bob" },
    ],
    [
        "author can't edit like count",
        "DENY",
        "alice",
        "update",
        recipePath,
        recipe,
        { ...recipe, likeCount: 50 },
    ],
    [
        "user likes a recipe",
        "ALLOW",
        "carol",
        "update",
        recipePath,
        recipe,
        { ...recipe, likes: { bob: true, carol: true }, likeCount: 2 },
    ],
    [
        "user unlikes a recipe",
        "ALLOW",
        "bob",
        "update",
        recipePath,
        recipe,
        { ...recipe, likes: {}, likeCount: 0 },
    ],
    [
        "can't remove someone else's like",
        "DENY",
        "carol",
        "update",
        recipePath,
        recipe,
        { ...recipe, likes: {}, likeCount: 0 },
    ],
    [
        "can't inflate like count",
        "DENY",
        "carol",
        "update",
        recipePath,
        recipe,
        { ...recipe, likes: { bob: true, carol: true }, likeCount: 10 },
    ],
    [
        "user rates a recipe",
        "ALLOW",
        "carol",
        "update",
        recipePath,
        recipe,
        {
            ...recipe,
            ratings: { bob: 4, carol: 5 },
            ratingCount: 2,
            averageRating: 4.5,
        },
    ],
    [
        "rating must be 1–5",
        "DENY",
        "carol",
        "update",
        recipePath,
        recipe,
        {
            ...recipe,
            ratings: { bob: 4, carol: 50 },
            ratingCount: 2,
            averageRating: 27,
        },
    ],
    [
        "comment count +1",
        "ALLOW",
        "carol",
        "update",
        recipePath,
        recipe,
        { ...recipe, commentCount: 3 },
    ],
    [
        "comment count can't jump",
        "DENY",
        "carol",
        "update",
        recipePath,
        recipe,
        { ...recipe, commentCount: 100 },
    ],
    [
        "author deletes own recipe",
        "ALLOW",
        "alice",
        "delete",
        recipePath,
        recipe,
    ],
    ["non-author can't delete", "DENY", "bob", "delete", recipePath, recipe],
    [
        "user comments as themselves",
        "ALLOW",
        "bob",
        "create",
        commentPath,
        null,
        comment,
    ],
    [
        "can't comment as someone else",
        "DENY",
        "carol",
        "create",
        commentPath,
        null,
        comment,
    ],
    [
        "commenter edits own text",
        "ALLOW",
        "bob",
        "update",
        commentPath,
        comment,
        { ...comment, text: "Edited" },
    ],
    [
        "can't edit someone else's comment",
        "DENY",
        "carol",
        "update",
        commentPath,
        comment,
        { ...comment, text: "x" },
    ],
    [
        "can't reassign a comment",
        "DENY",
        "bob",
        "update",
        commentPath,
        comment,
        { ...comment, userId: "carol" },
    ],
    [
        "commenter deletes own comment",
        "ALLOW",
        "bob",
        "delete",
        commentPath,
        comment,
    ],
    [
        "recipe author deletes a comment",
        "ALLOW",
        "alice",
        "delete",
        commentPath,
        comment,
        null,
        recipeLookup,
    ],
    [
        "others can't delete a comment",
        "DENY",
        "carol",
        "delete",
        commentPath,
        comment,
        null,
        recipeLookup,
    ],
    [
        "user updates own profile",
        "ALLOW",
        "alice",
        "update",
        `${DOCS}/users/alice`,
        { username: "A" },
        { username: "Alice", savedRecipes: ["r1"] },
    ],
    [
        "can't edit someone else's profile",
        "DENY",
        "bob",
        "update",
        `${DOCS}/users/alice`,
        { username: "A" },
        { username: "Hacked" },
    ],
    [
        "profiles can't hold an email",
        "DENY",
        "alice",
        "create",
        `${DOCS}/users/alice`,
        null,
        { username: "A", email: "a@example.com" },
    ],
];

(async () => {
    const client = await new GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    }).getClient();
    const testCases = cases.map(
        ([, expectation, uid, method, docPath, existing, incoming, mocks]) => ({
            expectation,
            request: {
                auth: uid ? { uid } : null,
                method,
                path: docPath,
                ...(incoming ? { resource: { data: incoming } } : {}),
            },
            ...(existing ? { resource: { data: existing } } : {}),
            ...(mocks ? { functionMocks: mocks } : {}),
        })
    );

    const { data } = await client.request({
        url: `https://firebaserules.googleapis.com/v1/projects/${PROJECT}:test`,
        method: "POST",
        data: {
            source: { files: [{ name: "firestore.rules", content: source }] },
            testSuite: { testCases },
        },
    });

    (data.issues || []).forEach((i) =>
        console.log(
            "RULES ISSUE:",
            i.severity,
            i.description,
            i.sourcePosition?.line
        )
    );
    let failed = 0;
    data.testResults.forEach((result, i) => {
        const ok = result.state === "SUCCESS";
        if (!ok) failed++;
        console.log(
            `${ok ? "✓" : "✗"} ${cases[i][0]} (${cases[i][1]})${ok ? "" : " – " + (result.debugMessages || []).join("; ")}`
        );
    });
    console.log(`\n${cases.length - failed}/${cases.length} passed`);
    process.exit(failed ? 1 : 0);
})().catch((e) => {
    console.error(
        "Rules test failed:",
        e.response?.data?.error?.message || e.message
    );
    process.exit(1);
});
