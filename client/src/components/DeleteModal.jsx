import { useEffect } from "react";

export default function DeleteModal({
    show,
    onClose,
    onConfirm,
}) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (show) {
            window.addEventListener("keydown", handleEsc);
        }

        return () => window.removeEventListener("keydown", handleEsc);
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/60 backdrop-blur-sm
                px-4
            "
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    w-full max-w-md
                    rounded-2xl
                    bg-[var(--card)]
                    border border-[var(--border)]
                    p-6 shadow-2xl

                    animate-[fadeIn_0.15s_ease-in-out]
                "
            >
                {/* TITLE */}
                <h2 className="text-2xl font-bold text-[var(--text)]">
                    Delete URL?
                </h2>

                {/* MESSAGE */}
                <p className="mt-3 text-[var(--muted)]">
                    This action cannot be undone.
                </p>

                {/* BUTTONS */}
                <div className="mt-6 flex justify-end gap-3">

                    {/* CANCEL (SAFE) */}
                    <button
                        onClick={onClose}
                        className="
                            px-4 py-2 rounded-xl
                            bg-[var(--bg)]
                            border border-[var(--border)]
                            text-[var(--text)]
                            hover:bg-[var(--hover)]
                            transition
                        "
                    >
                        Cancel
                    </button>

                    {/* DELETE (DANGER) */}
                    <button
                        onClick={onConfirm}
                        className="
                            px-4 py-2 rounded-xl
                            bg-red-500/10 text-red-400
                            border border-red-500/30
                            hover:bg-red-500/20
                            transition
                        "
                    >
                        Delete
                    </button>

                </div>
            </div>
        </div>
    );
}