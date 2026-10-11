// Shrink photos in the browser before uploading: phone photos are often
// 3–8 MB, while a 1600px WebP looks the same on screen at ~200 KB.

const loadBitmap = async (file) => {
    if (typeof createImageBitmap === "function") {
        // "from-image" applies the EXIF rotation from phone cameras
        return createImageBitmap(file, { imageOrientation: "from-image" });
    }
    const url = URL.createObjectURL(file);
    try {
        const img = new Image();
        img.src = url;
        await img.decode();
        return img;
    } finally {
        URL.revokeObjectURL(url);
    }
};

const toBlob = (canvas, type, quality) =>
    new Promise((resolve) => canvas.toBlob(resolve, type, quality));

/**
 * Resize so the longest side is at most `maxSize` px and re-encode as WebP
 * (JPEG where WebP encoding isn't supported). Returns the original file if
 * it can't be decoded (e.g. HEIC in some browsers) or wouldn't get smaller.
 */
export const compressImage = async (
    file,
    { maxSize = 1600, quality = 0.82, maxBytes = Infinity } = {}
) => {
    if (!file?.type?.startsWith("image/") || file.type === "image/gif") {
        return file;
    }

    try {
        const bitmap = await loadBitmap(file);
        const scale = Math.min(
            1,
            maxSize / Math.max(bitmap.width, bitmap.height)
        );
        const width = Math.round(bitmap.width * scale);
        const height = Math.round(bitmap.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
        bitmap.close?.();

        let blob = await toBlob(canvas, "image/webp", quality);
        if (!blob || blob.type !== "image/webp") {
            blob = await toBlob(canvas, "image/jpeg", quality);
        }
        if (!blob) return file;
        if (blob.size >= file.size && file.size <= maxBytes) return file;

        const extension = blob.type === "image/webp" ? "webp" : "jpg";
        const name = file.name.replace(/\.[^.]+$/, "") || "photo";
        return new File([blob], `${name}.${extension}`, { type: blob.type });
    } catch (error) {
        console.warn("Image compression skipped:", error);
        return file;
    }
};

/**
 * Compress progressively (smaller dimensions, lower quality) until the
 * result fits in `maxBytes`. Throws if even the smallest attempt is too big.
 */
export const compressToFit = async (
    file,
    maxBytes,
    { maxSize = 1600 } = {}
) => {
    const attempts = [
        { maxSize, quality: 0.82 },
        { maxSize: Math.min(maxSize, 1280), quality: 0.75 },
        { maxSize: Math.min(maxSize, 1024), quality: 0.7 },
        { maxSize: Math.min(maxSize, 800), quality: 0.6 },
    ];
    for (const options of attempts) {
        const result = await compressImage(file, { ...options, maxBytes });
        if (result.size <= maxBytes) return result;
    }
    throw Object.assign(
        new Error("Image is too large even after compression"),
        {
            code: "image/too-large",
        }
    );
};

export const blobToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
