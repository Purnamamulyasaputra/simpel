import { useEffect, useRef, useState } from 'react';

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return `Hari ini, ${date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        })}`;
    } else if (diffDays === 1) {
        return `Kemarin, ${date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        })}`;
    } else if (diffDays < 7) {
        return `${diffDays} hari yang lalu`;
    } else {
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }
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

export default function DetailTiket({ tiket, onCloseTicket, onSendMessage }) {
    const [replyMessage, setReplyMessage] = useState("");
    const repliesContainerRef = useRef(null);

    useEffect(() => {
        if (repliesContainerRef.current) {
            repliesContainerRef.current.scrollTop = repliesContainerRef.current.scrollHeight;
        }
    }, [tiket]);

    function handleSend() {
        onSendMessage(tiket.id, replyMessage);
        setReplyMessage("");
    }

    if (!tiket) {
        return (
        <div className="bg-white p-6 lg:p-10 text-center">
            <i className="fas fa-inbox text-4xl lg:text-5xl text-gray-300 mb-3"></i>
            <p className="text-gray-500 font-medium text-sm lg:text-base">Pilih tiket untuk melihat detail</p>
            <p className="text-xs lg:text-sm text-gray-400 mt-1">
                Percakapan dengan petugas akan tampil di sini
            </p>
        </div>
        );
    }

    const checkStatus = tiket.status === 'OPEN' || tiket.status === 'IN_PROGRESS';
    const isResolved = tiket.status === 'RESOLVED';
    const isClosed = tiket.status === 'CLOSED';
    const messages = Array.isArray(tiket.messages) ? tiket.messages : [];

    return (
        <div className="bg-white overflow-hidden flex flex-col">
            <div className="p-3 lg:p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-start justify-between gap-2 lg:gap-4">
                    <div>
                        <h4 className="text-sm lg:text-base font-bold text-gray-800 leading-tight">ID Tiket - {tiket.id}</h4>
                        <p className="text-[10px] lg:text-xs text-gray-500 mt-1">
                            <i className="fas fa-calendar-alt mr-1"></i>
                            Dibuat {new Date(tiket.createdAt).toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="scale-90 lg:scale-100 origin-top-right" dangerouslySetInnerHTML={{ __html: getStatusBadge(tiket.status) }} />
                </div>

                <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-3 lg:mt-4 text-[10px] lg:text-xs">
                    <div className="bg-blue-100 lg:bg-blue-200 rounded-md p-2 lg:p-3">
                        <p className="text-gray-500 mb-0.5 lg:mb-1">Kategori</p>
                        <p className="font-medium text-gray-800">{tiket.category}</p>
                    </div>

                    <div className="bg-blue-100 lg:bg-blue-200 rounded-md p-2 lg:p-3">
                        <p className="text-gray-500 mb-0.5 lg:mb-1">Petugas</p>
                        <p className="font-medium text-gray-800">
                            {tiket.petugas?.username || 'Belum diassign'}
                        </p>
                    </div>
                </div>

                <div className="mt-3 lg:mt-4">
                    <p className="text-[10px] lg:text-xs text-gray-500 mb-1 lg:mb-2">Deskripsi</p>
                    <div className="bg-blue-50 lg:bg-blue-100 border border-blue-100 rounded-md p-2 lg:p-3">
                        <p className="text-[11px] lg:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {tiket.description}
                        </p>
                    </div>
                </div>

                {isResolved && (
                    <div className="mt-3 lg:mt-4 rounded-lg border border-green-200 bg-green-50 p-2 lg:p-3 text-[11px] lg:text-sm text-green-700">
                        <i className="fas fa-check-circle mr-1.5 lg:mr-2"></i>
                        Tiket telah diselesaikan oleh petugas. Jika masih ada kendala, buat tiket baru.
                    </div>
                )}

                {isClosed && (
                    <div className="mt-3 lg:mt-4 rounded-lg border border-gray-200 bg-gray-50 p-2 lg:p-3 text-[11px] lg:text-sm text-gray-600">
                        <i className="fas fa-lock mr-1.5 lg:mr-2"></i>
                        Tiket telah ditutup.
                    </div>
                )}
            </div>

            <div className="p-3 lg:p-4">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h5 className="font-semibold text-gray-800 flex items-center gap-1.5 lg:gap-2 text-sm lg:text-base">
                        <i className="fas fa-comments text-blue-500"></i> Percakapan
                    </h5>

                    <span className="text-[10px] lg:text-xs text-gray-400">
                        {messages.length} pesan
                    </span>
                </div>

                <div ref={repliesContainerRef} className="space-y-2 lg:space-y-3 pr-1">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => {
                            const isFromMahasiswa = msg.sender === 'STUDENT';
                            return (
                                <div key={msg.id || index} className={`flex ${isFromMahasiswa ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-lg px-3 py-2 lg:px-4 lg:py-3 ${isFromMahasiswa ? 'bg-green-100 lg:bg-green-200 text-green-800' : 'bg-blue-100 lg:bg-blue-200 text-blue-800'}`}>
                                        <div className="flex items-center justify-between gap-2 lg:gap-3 mb-1">
                                            <span className='text-[10px] lg:text-xs font-bold'>
                                                <i className={`fas ${isFromMahasiswa ? 'fa-user' : 'fa-user-tie'} mr-1`}></i>
                                                {isFromMahasiswa ? 'Anda' : 'Petugas'}
                                            </span>
                                            <span className='text-[9px] lg:text-[11px] text-gray-500 opacity-80'>
                                                {formatDate(msg.timestamp)}
                                            </span>
                                        </div>
                                        <p className="text-[11px] lg:text-sm leading-relaxed">
                                            {msg.content || '(pesan tidak tersedia)'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 py-6 lg:py-8 text-center text-xs lg:text-sm text-gray-400">
                            Belum ada percakapan.
                        </div>
                    )}
                </div>

                {checkStatus && (
                    <div className="mt-3 lg:mt-4 pt-2 lg:pt-3 border-t border-gray-200">
                        <label className="block text-[11px] lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2"> Balasan Anda </label>
                        <textarea
                            rows="2"
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            className="outline-none w-full border rounded-lg p-2 text-xs lg:text-sm focus:ring-1 focus:ring-blue-500 focus:border-t border-gray-200 transparent resize-none"
                            placeholder="Ketik balasan Anda di sini..."
                        />
                        <div className="flex justify-end mt-1.5 lg:mt-2">
                            <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg transition flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-sm">
                                <i className="fas fa-paper-plane"></i>
                                Kirim Balasan
                            </button>
                        </div>
                    </div>
                )}

                {checkStatus  && (
                    <div className="mt-3 lg:mt-5 pt-3 lg:pt-4 border-t border-gray-200">
                        <button onClick={() => onCloseTicket(tiket.id)} className="w-full rounded-lg bg-red-500 px-3 py-2 lg:px-4 lg:py-2.5 text-white transition hover:bg-red-600 flex items-center justify-center gap-1.5 lg:gap-2 text-xs lg:text-sm">
                            <i className="fas fa-times-circle"></i> Tutup Tiket
                        </button>
                        <p className="mt-1.5 lg:mt-2 text-center text-[10px] lg:text-xs text-gray-400">Tiket yang sudah ditutup tidak dapat dibuka kembali</p>
                    </div>
                )}
            </div>
        </div>
    );
}