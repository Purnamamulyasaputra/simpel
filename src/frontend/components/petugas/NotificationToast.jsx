export default function NotificationToast({ show, message, type = "success" }) {
    if (!show) return null;

    const variants = {
        success: {
            bg: "bg-green-500",
            icon: "fa-check-circle",
        },
        error: {
            bg: "bg-red-500",
            icon: "fa-exclamation-circle",
        },
        info: {
            bg: "bg-blue-500",
            icon: "fa-info-circle",
        },
    };

    const current = variants[type] || variants.success;

    return (
        <div className="fixed top-20 right-5 z-50 transition-all duration-300 shadow-lg rounded-lg">
            <div className={`${current.bg} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`} >
                <i className={`fas ${current.icon}`}></i>
                <span>{message}</span>
            </div>
        </div>
    );
}