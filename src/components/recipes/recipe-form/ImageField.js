import { useEffect, useState } from "react";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";

const MAX_SIZE_MB = 5;

export const isValidImageUrl = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

export const ImageField = ({ file, url, onFileChange, onUrlChange }) => {
    const [preview, setPreview] = useState("");
    const [dragging, setDragging] = useState(false);
    const [fileError, setFileError] = useState("");

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
        setPreview(isValidImageUrl(url) ? url : "");
    }, [file, url]);

    const pickFile = (picked) => {
        if (!picked) return;
        if (!picked.type.startsWith("image/")) {
            setFileError("That file isn't an image. Try a JPG, PNG or WebP.");
            return;
        }
        if (picked.size > MAX_SIZE_MB * 1024 * 1024) {
            setFileError(`Images must be smaller than ${MAX_SIZE_MB} MB.`);
            return;
        }
        setFileError("");
        onFileChange(picked);
    };

    const clear = () => {
        onFileChange(null);
        onUrlChange("");
        setFileError("");
    };

    const fileInput = (
        <input
            id="recipe-image-file"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
                pickFile(e.target.files?.[0]);
                e.target.value = "";
            }}
        />
    );

    return (
        <div>
            {preview ? (
                <div className="relative overflow-hidden rounded-xl">
                    <img
                        src={preview}
                        alt="Recipe preview"
                        className="aspect-[16/9] w-full object-cover"
                        onError={() => setPreview("")}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-neutral-950/70 to-transparent p-3">
                        <label
                            htmlFor="recipe-image-file"
                            className="btn cursor-pointer bg-white/90 px-3 py-2 text-neutral-900 backdrop-blur hover:bg-white"
                        >
                            <RefreshCw className="h-4 w-4" /> Replace
                        </label>
                        <button
                            type="button"
                            onClick={clear}
                            className="btn bg-white/90 px-3 py-2 text-red-600 backdrop-blur hover:bg-white"
                        >
                            <Trash2 className="h-4 w-4" /> Remove
                        </button>
                    </div>
                    {fileInput}
                </div>
            ) : (
                <label
                    id="recipe-image"
                    htmlFor="recipe-image-file"
                    tabIndex={-1}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        pickFile(e.dataTransfer.files?.[0]);
                    }}
                    className={`flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 text-center transition-colors focus:outline-none focus-within:ring-2 focus-within:ring-brand-500 ${
                        dragging
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                            : "border-neutral-300 bg-neutral-50 hover:border-brand-400 hover:bg-brand-50/50 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:border-brand-500"
                    }`}
                >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm dark:bg-neutral-900">
                        <ImagePlus className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            Click to upload
                        </span>{" "}
                        <span className="text-neutral-600 dark:text-neutral-400">
                            or drag and drop a photo
                        </span>
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        JPG, PNG or WebP · up to {MAX_SIZE_MB} MB · landscape
                        photos look best
                    </span>
                    {fileInput}
                </label>
            )}

            {fileError && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {fileError}
                </p>
            )}

            {!file && (
                <div className="mt-4">
                    <label htmlFor="imageUrl" className="label">
                        Or paste an image link
                    </label>
                    <input
                        id="imageUrl"
                        type="url"
                        className="input"
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => onUrlChange(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};
