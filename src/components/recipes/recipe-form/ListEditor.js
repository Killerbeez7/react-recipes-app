import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";

// Grow a textarea to fit its content
const autoSize = (el) => {
    if (!el || el.tagName !== "TEXTAREA") return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
};

/**
 * Editable list of single-line entries (ingredients, steps, tips).
 * Enter adds a row below, Backspace on an empty row removes it, and pasting
 * several lines splits them into separate rows.
 */
export const ListEditor = ({
    id,
    items,
    onChange,
    placeholder,
    addLabel,
    numbered = false,
    multiline = false,
}) => {
    const fieldRefs = useRef([]);
    const [focusIndex, setFocusIndex] = useState(null);

    useEffect(() => {
        fieldRefs.current.forEach(autoSize);
    }, [items]);

    useEffect(() => {
        if (focusIndex === null) return;
        fieldRefs.current[focusIndex]?.focus();
        setFocusIndex(null);
    }, [focusIndex, items]);

    const update = (index, value) =>
        onChange(items.map((item, i) => (i === index ? value : item)));

    const insertAfter = (index, values = [""]) => {
        const next = [...items];
        next.splice(index + 1, 0, ...values);
        onChange(next);
        setFocusIndex(index + values.length);
    };

    const remove = (index) => {
        const next = items.filter((_, i) => i !== index);
        onChange(next.length ? next : [""]);
        setFocusIndex(Math.max(0, index - 1));
    };

    const onKeyDown = (index) => (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            insertAfter(index);
        } else if (e.key === "Backspace" && !items[index] && items.length > 1) {
            e.preventDefault();
            remove(index);
        }
    };

    const onPaste = (index) => (e) => {
        const lines = e.clipboardData
            .getData("text")
            .split(/\r?\n/)
            .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
            .filter(Boolean);
        if (lines.length < 2) return;

        e.preventDefault();
        if (items[index].trim()) {
            insertAfter(index, lines);
        } else {
            const next = [...items];
            next.splice(index, 1, ...lines);
            onChange(next);
            setFocusIndex(index + lines.length - 1);
        }
    };

    const Field = multiline ? "textarea" : "input";

    return (
        <div>
            <ol className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="group flex items-start gap-3">
                        <span
                            aria-hidden="true"
                            className={`mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                numbered
                                    ? "bg-brand-600 text-white"
                                    : "text-neutral-400"
                            }`}
                        >
                            {numbered ? index + 1 : "•"}
                        </span>
                        <Field
                            id={`${id}-${index}`}
                            ref={(el) => (fieldRefs.current[index] = el)}
                            value={item}
                            rows={multiline ? 1 : undefined}
                            aria-label={`${addLabel.replace(/^Add /, "")} ${index + 1}`}
                            placeholder={index === 0 ? placeholder : ""}
                            onChange={(e) => {
                                update(index, e.target.value);
                                autoSize(e.target);
                            }}
                            onKeyDown={onKeyDown(index)}
                            onPaste={onPaste(index)}
                            className={`input flex-1 ${multiline ? "resize-none overflow-hidden leading-6" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            aria-label={`Remove ${addLabel.replace(/^Add /, "")} ${index + 1}`}
                            className="btn-icon mt-0.5 h-9 w-9 shrink-0 text-neutral-400 opacity-100 hover:text-red-600 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100 dark:hover:text-red-400"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </li>
                ))}
            </ol>
            <button
                type="button"
                onClick={() => insertAfter(items.length - 1)}
                className="btn-ghost mt-3 px-3 text-brand-700 dark:text-brand-400"
            >
                <Plus className="h-4 w-4" /> {addLabel}
            </button>
        </div>
    );
};
