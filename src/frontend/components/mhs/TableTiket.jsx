function getStatusBadge(status) {
    switch (status) {
        case 'OPEN':
            return '<span class="status-badge status-open text-[10px] py-0.5 px-2">Open</span>';
        case 'IN_PROGRESS':
            return '<span class="status-badge status-progress text-[10px] py-0.5 px-2">In Progress</span>';
        case 'RESOLVED':
            return '<span class="status-badge status-resolved text-[10px] py-0.5 px-2">Resolved</span>';
        case 'CLOSED':
            return '<span class="status-badge status-closed text-[10px] py-0.5 px-2">Closed</span>';
        case 'COMPLETED':
            return '<span class="status-badge status-resolved text-[10px] py-0.5 px-2">Completed</span>';
        default:
            return '<span class="status-badge status-open text-[10px] py-0.5 px-2">' + status + '</span>';
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return `Hari ini, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
        return `Kemarin, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
        return `${diffDays} hari lalu`;
    } else {
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
}

export default function TableTiket({ dataTiket, selectedTicketId, onViewDetail, onCloseTicket }) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-2 sm:p-2.5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="font-bold text-xs sm:text-sm text-gray-700">
                    <i className="fas fa-tasks mr-1.5 text-blue-600 text-xs sm:text-sm"></i>Riwayat Tiket Saya
                </h3>
                <p className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5">
                    Klik tombol detail untuk melihat percakapan dengan petugas
                </p>
            </div>

            {/* Mobile: Card layout */}
            <div className="block sm:hidden">
                {dataTiket.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-[10px] px-3">
                        Belum ada tiket. Buat tiket baru dengan tombol di atas
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {dataTiket.map((tiket) => (
                            <div key={tiket.id} className={`p-2.5 ${selectedTicketId === tiket.id ? 'bg-blue-50/50' : ''}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-[10px] text-gray-800">#{tiket.id}</span>
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium text-blue-700 bg-blue-50">
                                            {tiket.category}
                                        </span>
                                    </div>
                                    <div className="scale-90 origin-top-right" dangerouslySetInnerHTML={{ __html: getStatusBadge(tiket.status) }} />
                                </div>
                                <p className="text-[10px] text-gray-600 mb-1.5 line-clamp-1">{tiket.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] text-gray-400">{formatDate(tiket.createdAt)}</span>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => onViewDetail(tiket.id)} className="px-2 py-0.5 text-[9px] bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition shadow-sm" title="Lihat detail">
                                            Detail
                                        </button>
                                        {(tiket.status === 'OPEN' || tiket.status === 'IN_PROGRESS') && (
                                            <button onClick={() => onCloseTicket(tiket.id)} className="px-1.5 py-0.5 text-[9px] bg-red-50 hover:bg-red-100 text-red-600 rounded font-medium transition" title="Tutup tiket">
                                                Tutup
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden sm:block overflow-x-auto w-full">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-2.5 py-2 text-left text-[10px] font-bold text-gray-500 uppercase whitespace-nowrap">ID</th>
                            <th className="px-2.5 py-2 text-left text-[10px] font-bold text-gray-500 uppercase whitespace-nowrap">Kategori</th>
                            <th className="px-2.5 py-2 text-left text-[10px] font-bold text-gray-500 uppercase whitespace-nowrap">Deskripsi</th>
                            <th className="px-2.5 py-2 text-left text-[10px] font-bold text-gray-500 uppercase whitespace-nowrap">Status</th>
                            <th className="px-2.5 py-2 text-left text-[10px] font-bold text-gray-500 uppercase whitespace-nowrap">Tanggal</th>
                            <th className="px-2.5 py-2 text-left text-[10px] font-bold text-gray-500 uppercase whitespace-nowrap text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataTiket.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-400 text-xs">
                                    Belum ada tiket. Buat tiket baru dengan tombol di atas
                                </td>
                            </tr>
                        ) : (
                            dataTiket.map((tiket) => (
                                <tr key={tiket.id} className={`border-b border-gray-100 table-row-hover ${selectedTicketId === tiket.id ? 'bg-blue-50/50' : ''}`} >
                                    <td className="px-2.5 py-2 font-medium text-gray-800 text-xs whitespace-nowrap">
                                        #{tiket.id} {tiket.status === 'IN_PROGRESS' && (
                                            <span className="ml-1 text-blue-500">
                                                <i className="fas fa-spinner fa-fw animate-spin text-[10px]"></i>
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-2.5 py-2 whitespace-nowrap">
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-blue-700 bg-blue-50">
                                            {tiket.category}
                                        </span>
                                    </td>

                                    <td className="px-2.5 py-2">
                                        <p className="text-[11px] text-gray-600 truncate max-w-[100px] lg:max-w-xs">
                                            {tiket.description}
                                        </p>
                                    </td>

                                    <td className="px-2.5 py-2 whitespace-nowrap" dangerouslySetInnerHTML={{ __html: getStatusBadge(tiket.status) }} />
                                    <td className="px-2.5 py-2 text-[10px] text-gray-500 whitespace-nowrap">
                                        {formatDate(tiket.createdAt)}
                                    </td>

                                    <td className="px-2.5 py-2 whitespace-nowrap text-center">
                                        <div className="flex justify-center gap-1.5">
                                            <button onClick={() => onViewDetail(tiket.id)} className="px-2 py-0.5 text-[10px] bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition shadow-sm" title="Lihat detail" >
                                                Detail
                                            </button>
                                            {(tiket.status === 'OPEN' || tiket.status === 'IN_PROGRESS') && (
                                                <button onClick={() => onCloseTicket(tiket.id)} className="px-1.5 py-0.5 text-[10px] bg-red-50 hover:bg-red-100 text-red-600 rounded font-medium transition" title="Tutup tiket" >
                                                    Tutup
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}