import { useEffect, useState } from "react";
import { isStoredImage, resolveImage } from "../services/imageService";

// Turns an image field (http URL, data URL or "fsimg:<id>") into an <img> src
export const useImageSrc = (value) => {
    const [src, setSrc] = useState(isStoredImage(value) ? "" : value || "");
    const [loading, setLoading] = useState(isStoredImage(value));

    useEffect(() => {
        if (!isStoredImage(value)) {
            setSrc(value || "");
            setLoading(false);
            return;
        }
        let ignore = false;
        setLoading(true);
        resolveImage(value).then((data) => {
            if (ignore) return;
            setSrc(data);
            setLoading(false);
        });
        return () => {
            ignore = true;
        };
    }, [value]);

    return { src, loading };
};
