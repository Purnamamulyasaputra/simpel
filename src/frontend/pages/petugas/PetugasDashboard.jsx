import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { useNotification } from '../../context/NotificationContext';
import { useLoading } from '../../context/LoadingContext';

// Dummy data
const initialTickets = [
  { id: 101, mahasiswa: 'Andi Setiawan', category: 'Akademik', description: 'Kendala akses SIAKAD', status: 'OPEN', createdAt: '2025-02-10', assignedTo: null, replies: [] },
  { id: 102, mahasiswa: 'Budi Pratama', category: 'Teknis', description: 'Wifi kampus lambat', status: 'IN_PROGRESS', createdAt: '2025-02-12', assignedTo: 1, replies: [{ id: 1, from: 'petugas', sender: 'Joko Supriyanto', message: 'Sedang diperiksa', createdAt: '2025-02-13' }] },
  { id: 103, mahasiswa: 'Citra Dewi', category: 'Administrasi', description: 'Perubahan data KRS', status: 'RESOLVED', createdAt: '2025-02-05', assignedTo: 1, replies: [] }
];

const PetugasDashboard = ({ user, onLogout }) => {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const { showNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  const currentPetugas = { id: 1, username: user?.username || 'joko_supriyanto', fullName: user?.fullName || 'Joko Supriyanto' };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    progress: tickets.filter(t => t.status === 'IN_PROGRESS').length
  };

  const ticketColumns = [
    { key: 'id', label: 'ID', render: (val) => `#${val}` },
    { key: 'mahasiswa', label: 'Mahasiswa' },
    { key: 'category', label: 'Kategori' },
    { key: 'description', label: 'Deskripsi', render: (val) => val.substring(0, 40) + (val.length > 40 ? '...' : '') },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> }
  ];

  const ticketActions = [
    {
      icon: 'check-circle',
      label: 'Assign',
      color: 'text-green-500',
      condition: (row) => row.status === 'OPEN',
      onClick: (row) => handleAssign(row.id)
    },
    {
      icon: 'check-double',
      label: 'Resolve',
      color: 'text-purple-500',
      condition: (row) => row.status === 'IN_PROGRESS' && row.assignedTo === currentPetugas.id,
      onClick: (row) => handleResolve(row.id)
    },
    {
      icon: 'eye',
      label: 'Detail',
      color: 'text-blue-500',
      onClick: (row) => handleViewDetail(row)
    }
  ];

  const handleAssign = (ticketId) => {
    showLoading();
    setTimeout(() => {
      setTickets(tickets.map(t => 
        t.id === ticketId && t.status === 'OPEN'
          ? { ...t, status: 'IN_PROGRESS', assignedTo: currentPetugas.id, replies: [...t.replies, { id: Date.now(), from: 'petugas', sender: currentPetugas.fullName, message: 'Tiket ini telah di-assign kepada saya dan akan segera ditangani.', createdAt: new Date().toISOString() }] }
          : t
      ));
      showNotification(`Tiket #${ticketId} berhasil di-assign`, 'success');
      if (selectedTicket?.id === ticketId) handleViewDetail(tickets.find(t => t.id === ticketId));
      hideLoading();
    }, 500);
  };

  const handleResolve = (ticketId) => {
    showLoading();
    setTimeout(() => {
      setTickets(tickets.map(t => 
        t.id === ticketId && t.status === 'IN_PROGRESS'
          ? { ...t, status: 'RESOLVED', replies: [...t.replies, { id: Date.now(), from: 'petugas', sender: currentPetugas.fullName, message: 'Tiket ini telah diselesaikan.', createdAt: new Date().toISOString() }] }
          : t
      ));
      showNotification(`Tiket #${ticketId} telah di-resolve`, 'success');
      if (selectedTicket?.id === ticketId) handleViewDetail(tickets.find(t => t.id === ticketId));
      hideLoading();
    }, 500);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      showNotification('Pesan tidak boleh kosong', 'error');
      return;
    }
    
    showLoading();
    setTimeout(() => {
      setTickets(tickets.map(t => 
        t.id === selectedTicket?.id
          ? { ...t, replies: [...t.replies, { id: Date.now(), from: 'petugas', sender: currentPetugas.fullName, message: replyMessage, createdAt: new Date().toISOString() }] }
          : t
      ));
      showNotification('Balasan terkirim', 'success');
      setReplyMessage('');
      handleViewDetail(selectedTicket);
      hideLoading();
    }, 500);
  };

  const handleViewDetail = (ticket) => {
    const updatedTicket = tickets.find(t => t.id === ticket.id);
    setSelectedTicket(updatedTicket);
  };

  const filteredActions = (row) => ticketActions.filter(action => !action.condition || action.condition(row));

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-user-tie text-blue-600 text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Petugas Dashboard</h1>
              <p className="text-xs text-gray-500">{currentPetugas.fullName}</p>
            </div>
          </div>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-md flex items-center gap-2">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </header>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Tiket" value={stats.total} icon="ticket-alt" color="purple" />
          <StatCard title="Tiket Open" value={stats.open} icon="clock" color="yellow" />
          <StatCard title="Dalam Proses" value={stats.progress} icon="spinner" color="blue" />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Table
            columns={ticketColumns}
            data={tickets}
            actions={(row) => filteredActions(row).map(action => ({ ...action, onClick: () => action.onClick(row) }))}
            title={<><i className="fas fa-tasks mr-2 text-blue-600"></i>Daftar Tiket</>}
          />
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="font-bold text-lg text-gray-700">
                <i className="fas fa-comments mr-2 text-blue-600"></i>Detail & Percakapan Tiket
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {selectedTicket ? `Tiket #${selectedTicket.id} - ${selectedTicket.mahasiswa}` : 'Pilih tiket untuk melihat detail'}
              </p>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" style={{ maxHeight: '500px' }}>
              {selectedTicket ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800">Tiket #{selectedTicket.id}</h4>
                    <p className="text-sm text-gray-600 mt-1"><strong>Mahasiswa:</strong> {selectedTicket.mahasiswa}</p>
                    <p className="text-sm text-gray-600"><strong>Kategori:</strong> {selectedTicket.category}</p>
                    <p className="text-sm text-gray-600"><strong>Deskripsi:</strong> {selectedTicket.description}</p>
                    <p className="text-sm text-gray-600"><strong>Status:</strong> <StatusBadge status={selectedTicket.status} /></p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h5 className="font-semibold text-gray-700 mb-3">Percakapan</h5>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedTicket.replies?.map(r => (
                        <div key={r.id} className={`${r.from === 'petugas' ? 'chat-bubble-petugas ml-auto' : 'chat-bubble-user mr-auto'} p-3 max-w-[85%]`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-bold ${r.from === 'petugas' ? 'text-blue-600' : 'text-green-600'}`}>
                              <i className={`fas ${r.from === 'petugas' ? 'fa-user-tie' : 'fa-user-graduate'} mr-1`}></i>
                              {r.sender}
                            </span>
                            <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-700">{r.message}</p>
                        </div>
                      ))}
                      {(!selectedTicket.replies || selectedTicket.replies.length === 0) && (
                        <p className="text-gray-400 text-center py-4">Belum ada pesan</p>
                      )}
                    </div>
                    
                    {selectedTicket.status === 'IN_PROGRESS' && selectedTicket.assignedTo === currentPetugas.id && (
                      <div className="mt-4 pt-3 border-t">
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          rows="2"
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Ketik balasan Anda..."
                        />
                        <div className="flex justify-end mt-2">
                          <Button size="sm" icon="paper-plane" onClick={handleSendReply}>
                            Kirim Balasan
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {selectedTicket.status === 'RESOLVED' && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
                        <i className="fas fa-check-circle text-green-600 mr-2"></i>
                        <span className="text-sm text-green-700">Tiket telah selesai</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-inbox text-5xl text-gray-300 mb-3"></i>
                  <p className="text-gray-400">Klik tombol "Detail" pada tiket untuk melihat percakapan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetugasDashboard;