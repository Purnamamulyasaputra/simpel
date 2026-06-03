function getStatusBadge(status) {
    switch (status) {
        case 'OPEN':
            return '<span class="status-badge status-open"><i class="fas fa-circle mr-1 text-[8px]"></i>Open</span>';
        case 'IN_PROGRESS':
            return '<span class="status-badge status-progress"><i class="fas fa-spinner mr-1"></i>In Progress</span>';
        case 'RESOLVED':
            return '<span class="status-badge status-resolved"><i class="fas fa-check-circle mr-1"></i>Resolved</span>';
        case 'CLOSED':
            return '<span class="status-badge status-closed"><i class="fas fa-lock mr-1"></i>Closed</span>';
        default:
            return `<span class="status-badge status-open">${status}</span>`;
    }
}

export default function TableTiketPetugas({ tickets, currentPetugas, selectedTicketId, onSelectTicket, onAssignTicket, onResolveTicket}) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="font-bold text-sm text-gray-700">
                    <i className="fas fa-tasks mr-1.5 text-blue-600"></i> Daftar Tiket
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Klik tombol aksi untuk menangani tiket</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">No</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Mahasiswa</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Kategori</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Deskripsi</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {tickets.length > 0 ? (
                            tickets.map((ticket, index) => {
                            const isAssignedToMe = ticket.staffId === currentPetugas.id;

                            return (
                                <tr key={`${ticket.id}-${index}`} className={`border-b border-gray-200 hover:bg-gray-50 ${
                                    selectedTicketId === ticket.id ? "bg-blue-50" : "" }`}>
                                    <td className="px-3 py-2 font-medium text-gray-800 text-xs">{index + 1}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs">{ticket.student?.name}</span>
                                        </div>
                                    </td>

                                    <td className="px-3 py-2">
                                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700">
                                            {ticket.category}
                                        </span>
                                    </td>

                                    <td className="px-3 py-2 max-w-xs">
                                        <p className="text-xs text-gray-600 truncate">
                                            {ticket.description.substring(0, 10)}
                                            {ticket.description.length > 10 ? "..." : ""}
                                        </p>
                                    </td>

                                    <td className="px-3 py-2" dangerouslySetInnerHTML={{ __html: getStatusBadge(ticket.status) }} />
                                    <td className="px-3 py-2">
                                        <div className="flex gap-0.5">
                                            {ticket.status === "OPEN" && (
                                                <button onClick={() => onAssignTicket(ticket.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition" title="Assign ke saya" >
                                                    <i className="fas fa-check-circle text-xs"></i>
                                                </button>
                                            )}

                                            {ticket.status === "IN_PROGRESS" && isAssignedToMe && (
                                                <button onClick={() => onResolveTicket(ticket.id)} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition" title="Resolve tiket" >
                                                    <i className="fas fa-check-double text-xs"></i>
                                                </button>
                                            )}
                                            
                                            <button onClick={() => onSelectTicket(ticket.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Lihat detail" >
                                                <i className="fas fa-eye text-xs"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-400">
                                    Belum ada tiket
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}