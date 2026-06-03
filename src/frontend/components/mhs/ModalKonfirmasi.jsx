export default function ModalKonfirmasi({ isOpen, onClose, onConfirm, pesan }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 transform transition-all fade-in">
                <div className="text-center">
                    {/* Ikon peringatan */}
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-exclamation-triangle text-2xl text-yellow-600"></i>
                    </div>

                    {/* Judul dan pesan */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Tutup Tiket</h3>
                    <p className="text-gray-500 mb-4">
                        {pesan || 'Apakah Anda yakin ingin menutup tiket ini? Tiket yang sudah ditutup tidak dapat dibuka kembali.'}
                    </p>

                    {/* Tombol konfirmasi */}
                    <div className="flex justify-center gap-3">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition" >
                            Batal
                        </button>
                        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition" >
                            Ya, Tutup Tiket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}