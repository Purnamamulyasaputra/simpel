export default function ConfirmModal({ open, title, message, onCancel, onConfirm }) {
    if (!open) return null;

    return <>
        <div className="fixed inset-0 modal-backdrop bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl">
                <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-exclamation-triangle text-2xl text-yellow-600"></i>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-500 mb-4">{message}</p>

                    <div className="flex justify-center gap-3">
                        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Batal</button>
                        <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"> Ya, Lanjutkan </button>
                    </div>
                </div>
            </div>
        </div>
    </>;
}