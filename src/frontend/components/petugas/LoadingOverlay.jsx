export default function LoadingOverlay({ show }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 modal-backdrop bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-xl shadow-xl text-center">
                <div className="w-8 h-8 mx-auto rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
                <p className="mt-3 text-gray-600">Memproses...</p>
            </div>
        </div>
    );
}