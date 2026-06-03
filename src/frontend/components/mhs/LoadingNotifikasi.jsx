import  { useEffect } from 'react';

export function LoadingSpinner({ isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 modal-backdrop bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-xl shadow-xl text-center">
                <div className="loading-spinner mx-auto"></div>
                <p className="mt-3 text-gray-600">Memproses...</p>
            </div>
        </div>
    );
}

export function NotificationToast({ message, type, isVisible, onClose }) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

    return (
        <div className="fixed top-20 right-5 z-50 transition-all duration-300 shadow-lg rounded-lg">
            <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
                <i className={`fas ${icon}`}></i>
                <span>{message}</span>
            </div>
        </div>
    );
}