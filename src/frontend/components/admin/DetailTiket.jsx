
function formatDate(dateString) {
    return new Date(dateString).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta"
    }) + " WIB";
}

export default function DetailTiket({ tiket, onClose }) {
    if (!tiket) return null;
    return (
        <div onClick={onClose} id="modalTicketDetail" className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl w-full max-w-2xl p-6 transform transition-all max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Detail Tiket</h3>
                    <button onClick={onClose} id="closeTicketModal" className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times text-xl" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-500">ID Tiket</p>
                            <p className="font-semibold text-gray-800">{tiket.id}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Mahasiswa</p>
                            <p className="font-semibold text-gray-800">
                                {tiket.student?.email || tiket.student?.name || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <p className="font-semibold text-gray-800">{tiket.category}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`status-badge ${tiket.status === 'OPEN' ? 'status-open' : tiket.status === 'IN_PROGRESS' ? 'status-progress' : 'status-resolved'}`}>
                                {tiket.status === 'OPEN' ? 'Open' : tiket.status === 'IN_PROGRESS' ? 'In Progress' : 'Resolved'}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Petugas</p>
                            <p className="font-semibold text-gray-800">
                                {tiket.staff?.username || 'Belum diassign'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Dibuat Pada</p>
                            <p className="font-semibold text-gray-800">{formatDate(tiket.createdAt)}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-2">Deskripsi</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">{tiket.description}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-2">Percakapan</p>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {tiket.messages && tiket.messages.length > 0 ? (
                                tiket.messages.map((r) => (
                                    <div key={r.id} className={`p-3 rounded-lg max-w-[85%] ${r.sender === 'STAFF' ? 'bg-blue-50 ml-auto' : 'bg-gray-50 mr-auto' }`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-xs font-semibold ${ r.sender === 'STAFF' ? 'text-blue-600' : 'text-green-600'}`}>
                                                <i className={`fas ${ r.sender === 'STAFF' ? 'fa-user-tie' : 'fa-user-graduate' } mr-1`} ></i>
                                                {r.sender === 'STAFF' ? (r.staff?.username || 'Petugas') : (r.student?.name || 'Mahasiswa')}
                                            </span>
                                            <span className="text-xs text-gray-400">{formatDate(r.timestamp)}</span>
                                        </div>
                                        <p className="text-sm text-gray-700">{r.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-4">Belum ada percakapan</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}