import { useEffect, useState } from "react";

export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(
        () => window.matchMedia?.(query).matches ?? false
    );

    useEffect(() => {
        const mq = window.matchMedia(query);
        const onChange = (e) => setMatches(e.matches);
        setMatches(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, [query]);

    return matches;
};
