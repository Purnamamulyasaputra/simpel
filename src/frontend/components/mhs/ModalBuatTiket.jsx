import { useState } from 'react';

export default function ModalBuatTiket({ isOpen, onClose, onSubmit }) {
    const [kategori, setKategori] = useState('');
    const [deskripsi, setDeskripsi] = useState('');

    const handleClose = () => {
        setKategori('');
        setDeskripsi('');
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ category: kategori, description: deskripsi });
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 modal-backdrop bg-opacity-50 flex items-center justify-center z-50 modal">
            <div className="bg-white rounded-xl w-[90%] max-w-sm lg:max-w-lg p-4 lg:p-6 transform transition-all fade-in">
                <div className="flex justify-between items-center mb-3 lg:mb-4">
                    <h3 className="text-base lg:text-xl font-bold text-gray-800">
                        <i className="fas fa-plus-circle text-blue-600 mr-1.5 lg:mr-2"></i>Buat Tiket Baru
                    </h3>
                    <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times text-lg lg:text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 lg:mb-4">
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Kategori *</label>
                        <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full border border-gray-300 text-xs lg:text-sm rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required >
                            <option value="">Pilih Kategori</option>
                            <option value="Akademik">📚 Akademik</option>
                            <option value="Teknis">💻 Teknis</option>
                            <option value="Administrasi">📋 Administrasi</option>
                            <option value="Sarana Prasarana">🏢 Sarana Prasarana</option>
                            <option value="Lainnya">❓ Lainnya</option>
                        </select>
                    </div>

                    <div className="mb-3 lg:mb-4">
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Deskripsi *</label>
                        <textarea
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            rows="4"
                            className="w-full outline-none text-xs lg:text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Jelaskan masalah Anda secara detail...&#10;&#10;Contoh:&#10;- Apa yang terjadi?&#10;- Kapan kejadiannya?&#10;- Sudahkah Anda mencoba solusi tertentu?"
                            required
                        />
                        <p className="text-[10px] lg:text-xs text-gray-400 mt-1">Minimal 5 karakter, maksimal 1000 karakter</p>
                    </div>

                    <div className="flex justify-end gap-2 mt-3 lg:mt-4">
                        <button type="button" onClick={handleClose} className="px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm bg-gray-300 rounded-lg hover:bg-gray-400 transition">
                            Batal
                        </button>
                        <button type="submit" className="px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5 lg:gap-2">
                            <i className="fas fa-paper-plane"></i>
                            Kirim Tiket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}