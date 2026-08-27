import { useEffect } from "react";
import QRCode from "react-qr-code";

export default function QRModal({ show, onClose, value }) {
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
            {/* MODAL BOX */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    w-full max-w-md
                    rounded-2xl
                    bg-[var(--card)]
                    border border-[var(--border)]
                    p-6 text-center
                    shadow-2xl

                    animate-[fadeIn_0.15s_ease-in-out]
                "
            >
                {/* TITLE */}
                <h2 className="text-xl font-bold text-[var(--text)] mb-4">
                    QR Code
                </h2>

                {/* QR */}
                <div className="bg-white p-4 rounded-xl inline-block">
                    <QRCode value={value} size={180} />
                </div>

                {/* URL */}
                <p className="text-[var(--muted)] text-sm mt-4 break-all">
                    {value}
                </p>

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="
                        mt-5 px-4 py-2 rounded-xl
                        bg-[var(--bg)]
                        border border-[var(--border)]
                        text-[var(--text)]
                        hover:bg-[var(--hover)]
                        transition
                    "
                >
                    Close
                </button>
            </div>
        </div>
    );
}