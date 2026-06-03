import { useEffect, useRef, useState } from "react";

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

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

export default function DetailPercakapanPetugas({ ticket, message, currentPetugas, onSendReply }) {
    const [replyMessage, setReplyMessage] = useState("");
    const repliesContainerRef = useRef(null);

    useEffect(() => {
        if (repliesContainerRef.current) {
            repliesContainerRef.current.scrollTop = repliesContainerRef.current.scrollHeight;
        }
    }, [ticket]);

    if (!ticket) {
        return <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <h3 className="font-bold text-sm text-gray-700">
                        <i className="fas fa-comments mr-1.5 text-blue-600"></i>
                        Detail & Percakapan Tiket
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                        Belum ada tiket dipilih
                    </p>
                </div>

                <div className="p-4 flex-1">
                    <div className="text-center py-8">
                        <i className="fas fa-inbox text-4xl text-gray-300 mb-2"></i>
                        <p className="text-gray-400 text-sm">
                            Klik tombol "Detail" pada tiket untuk melihat percakapan
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            Anda dapat membalas, assign, atau resolve tiket dari sini
                        </p>
                    </div>
                </div>
            </div>
        </>;
    }

    const isAssignedToMe = ticket.staffId === currentPetugas.id || ticket.staffId === null;
    const canReply = (ticket.status === "IN_PROGRESS" && isAssignedToMe) || ticket.status === "OPEN";

    function handleSend() {
        onSendReply(ticket.id, replyMessage);
        setReplyMessage("");
    }

    return <>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="font-bold text-sm text-gray-700">
                    <i className="fas fa-comments mr-1.5 text-blue-600"></i>
                    Detail & Percakapan Tiket
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5">
                    <i className="fas fa-ticket-alt mr-1"></i>
                    Tiket #{ticket.id} - {ticket.student?.name}
                </p>
            </div>

            <div className="p-3 flex-1 max-h-[450px] overflow-y-auto">
                <div className="space-y-3">

                    {/* Data Tiket pada Detail Tiket */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">
                                    Tiket #{ticket.id}
                                </h4>
                                <p className="text-[10px] text-gray-500 mt-0.5">
                                    Dibuat: {formatDate(ticket.createdAt)}
                                </p>
                            </div>
                            <div className="scale-90 origin-top-right" dangerouslySetInnerHTML={{ __html: getStatusBadge(ticket.status) }} />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <p className="text-gray-500">Mahasiswa</p>
                                <p className="font-medium text-gray-800">{ticket.student?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Kategori</p>
                                <p className="font-medium text-gray-800">{ticket.category}</p>
                            </div>
                        </div>

                        <div className="mt-2">
                            <p className="text-gray-500 text-xs">Deskripsi</p>
                            <p className="text-gray-700 text-xs mt-0.5">{ticket.description}</p>
                        </div>
                    </div>


                    {/* Bagian Percakapan */}
                    <div className="border-t border-gray-200 pt-3">
                        <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-1.5 text-xs">
                            <i className="fas fa-comments text-blue-500"></i>Percakapan
                            {ticket.replies?.length > 0 && (
                                <span className="text-[10px] text-gray-400">
                                    ({ticket.replies.length} pesan)
                                </span>
                            )}
                        </h5>

                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {message && message.length > 0 ? (
                                message.map((msg, index) => (
                                    <div key={index}>
                                        {msg.sender === 'STAFF' ? (
                                            <div ref={repliesContainerRef} className="p-2.5 max-w-[85%] bg-blue-100 rounded-[14px_14px_4px_14px] ml-auto">
                                                <div className="flex justify-between items-center mb-0.5 gap-2">
                                                    <span className="text-[10px] font-semibold text-blue-600">
                                                        <i className="fas fa-user-tie mr-1"></i> {msg.staff?.username || 'Petugas'}
                                                    </span>
                                                    <span className="text-[9px] text-gray-400">
                                                        {formatDate(msg.timestamp)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-700"> {msg.content}</p>
                                            </div>
                                        ) : (
                                            <div ref={repliesContainerRef} className="p-2.5 max-w-[85%] bg-green-100 rounded-[14px_14px_4px_14px]">
                                                <div className="flex justify-between items-center mb-0.5 gap-2">
                                                    <span className="text-[10px] font-semibold text-green-600">
                                                        <i className="fas fa-user mr-1"></i> {msg.student?.name || 'Mahasiswa'}
                                                    </span>
                                                    <span className="text-[9px] text-gray-400">
                                                        {formatDate(msg.timestamp)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-700">{msg.content}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 py-6 text-center text-xs text-gray-400">
                                    Belum ada percakapan.
                                </div>
                            )}
                        </div>

                        {canReply || ticket.status === "IN_PROGRESS" ? (
                            <div className="mt-3 pt-2 border-t border-gray-200">
                                <label className="block text-xs font-medium text-gray-700 mb-1.5"> Balasan Anda </label>
                                <textarea
                                    rows="2"
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    className="w-full border outline-none border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Ketik balasan Anda di sini..."
                                />
                                <div className="flex justify-end mt-1.5">
                                    <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 text-xs">
                                        <i className="fas fa-paper-plane"></i>
                                        Kirim Balasan
                                    </button>
                                </div>
                            </div>
                        ) : ticket.status === "IN_PROGRESS" && !isAssignedToMe ? (
                            <div className="mt-3 p-2.5 bg-yellow-50 rounded-lg text-center">
                                <i className="fas fa-lock text-yellow-600 mr-1.5"></i>
                                <span className="text-xs text-yellow-700">
                                    Tiket ini sedang ditangani oleh petugas lain
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    </>;
}