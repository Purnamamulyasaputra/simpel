import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/input';
import StatusBadge from '../../components/common/StatusBadge';
import { useNotification } from '../../context/NotificationContext';
import { useLoading } from '../../context/LoadingContext';

// Dummy data
const initialTickets = [
  { id: 101, category: 'Akademik', description: 'Kendala akses SIAKAD', status: 'OPEN', createdAt: '2025-02-10', replies: [] },
  { id: 102, category: 'Teknis', description: 'Wifi kampus lambat', status: 'IN_PROGRESS', createdAt: '2025-02-12', replies: [{ id: 1, from: 'petugas', sender: 'Joko Supriyanto', message: 'Sedang diperiksa', createdAt: '2025-02-13' }] },
  { id: 103, category: 'Administrasi', description: 'Perubahan data KRS', status: 'RESOLVED', createdAt: '2025-02-05', replies: [] }
];

const MahasiswaDashboard = ({ user, onLogout }) => {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingCloseId, setPendingCloseId] = useState(null);
  const [formData, setFormData] = useState({ category: '', description: '' });
  const { showNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    progress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    closed: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length
  };

  const ticketColumns = [
    { key: 'id', label: 'ID', render: (val) => `#${val}` },
    { key: 'category', label: 'Kategori' },
    { key: 'description', label: 'Deskripsi', render: (val) => val.substring(0, 40) + (val.length > 40 ? '...' : '') },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'createdAt', label: 'Tanggal' }
  ];

  const ticketActions = [
    { icon: 'eye', label: 'Detail', color: 'text-blue-500', onClick: (row) => handleViewDetail(row) },
    {
      icon: 'times-circle',
      label: 'Tutup',
      color: 'text-red-500',
      condition: (row) => row.status === 'OPEN' || row.status === 'IN_PROGRESS',
      onClick: (row) => openConfirmModal(row.id)
    }
  ];

  const handleCreateTicket = () => {
    if (!formData.category) {
      showNotification('Pilih kategori terlebih dahulu', 'error');
      return;
    }
    if (!formData.description || formData.description.length < 5) {
      showNotification('Deskripsi minimal 5 karakter', 'error');
      return;
    }
    
    showLoading();
    setTimeout(() => {
      const newId = Math.max(...tickets.map(t => t.id), 0) + 1;
      const newTicket = {
        id: newId,
        category: formData.category,
        description: formData.description,
        status: 'OPEN',
        createdAt: new Date().toISOString().slice(0,10),
        replies: []
      };
      setTickets([newTicket, ...tickets]);
      showNotification('Tiket berhasil dibuat!', 'success');
      setModalOpen(false);
      setFormData({ category: '', description: '' });
      hideLoading();
    }, 500);
  };

  const handleCloseTicket = () => {
    if (!pendingCloseId) return;
    
    showLoading();
    setTimeout(() => {
      setTickets(tickets.map(t => 
        t.id === pendingCloseId && (t.status === 'OPEN' || t.status === 'IN_PROGRESS')
          ? { ...t, status: 'CLOSED', replies: [...t.replies, { id: Date.now(), from: 'mahasiswa', sender: user?.fullName, message: 'Tiket ini ditutup oleh mahasiswa.', createdAt: new Date().toISOString() }] }
          : t
      ));
      showNotification(`Tiket #${pendingCloseId} berhasil ditutup`, 'success');
      if (selectedTicket?.id === pendingCloseId) handleViewDetail(tickets.find(t => t.id === pendingCloseId));
      setConfirmModalOpen(false);
      setPendingCloseId(null);
      hideLoading();
    }, 500);
  };

  const handleViewDetail = (ticket) => {
    const updatedTicket = tickets.find(t => t.id === ticket.id);
    setSelectedTicket(updatedTicket);
  };

  const openConfirmModal = (ticketId) => {
    setPendingCloseId(ticketId);
    setConfirmModalOpen(true);
  };

  const filteredActions = (row) => ticketActions.filter(action => !action.condition || action.condition(row));

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-user-graduate text-green-600 text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Mahasiswa Dashboard</h1>
              <p className="text-xs text-gray-500">{user?.fullName}</p>
            </div>
          </div>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-md flex items-center gap-2">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </header>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Tiket" value={stats.total} icon="ticket-alt" color="purple" />
          <StatCard title="Tiket Open" value={stats.open} icon="clock" color="yellow" />
          <StatCard title="Dalam Proses" value={stats.progress} icon="spinner" color="blue" />
          <StatCard title="Selesai/Ditutup" value={stats.closed} icon="check-circle" color="green" />
        </div>
        
        <div className="mb-6">
          <Button icon="plus-circle" onClick={() => setModalOpen(true)}>
            Buat Tiket Baru
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Table
            columns={ticketColumns}
            data={tickets}
            actions={(row) => filteredActions(row).map(action => ({ ...action, onClick: () => action.onClick(row) }))}
            title={<><i className="fas fa-tasks mr-2 text-blue-600"></i>Riwayat Tiket Saya</>}
          />
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="font-bold text-lg text-gray-700">
                <i className="fas fa-comments mr-2 text-blue-600"></i>Detail & Percakapan Tiket
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {selectedTicket ? `Tiket #${selectedTicket.id} - ${selectedTicket.category}` : 'Pilih tiket untuk melihat detail'}
              </p>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" style={{ maxHeight: '500px' }}>
              {selectedTicket ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">Tiket #{selectedTicket.id}</h4>
                        <p className="text-xs text-gray-500 mt-1">Dibuat: {selectedTicket.createdAt}</p>
                      </div>
                      <StatusBadge status={selectedTicket.status} />
                    </div>
                    <p className="text-sm text-gray-600"><strong>Kategori:</strong> {selectedTicket.category}</p>
                    <div className="mt-3">
                      <p className="text-gray-500 text-sm">Deskripsi</p>
                      <p className="text-gray-700 mt-1">{selectedTicket.description}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h5 className="font-semibold text-gray-700 mb-3">Percakapan</h5>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedTicket.replies?.map(r => (
                        <div key={r.id} className={`${r.from === 'mahasiswa' ? 'chat-bubble-user ml-auto' : 'chat-bubble-petugas mr-auto'} p-3 max-w-[85%]`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-bold ${r.from === 'mahasiswa' ? 'text-green-600' : 'text-blue-600'}`}>
                              <i className={`fas ${r.from === 'mahasiswa' ? 'fa-user-graduate' : 'fa-user-tie'} mr-1`}></i>
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
                    
                    {selectedTicket.status === 'RESOLVED' && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
                        <i className="fas fa-check-circle text-green-600 mr-2"></i>
                        <span className="text-sm text-green-700">Tiket telah selesai. Terima kasih!</span>
                      </div>
                    )}
                    
                    {(selectedTicket.status === 'OPEN' || selectedTicket.status === 'IN_PROGRESS') && (
                      <div className="mt-4">
                        <Button 
                          variant="danger" 
                          icon="times-circle" 
                          onClick={() => openConfirmModal(selectedTicket.id)}
                          className="w-full"
                        >
                          Tutup Tiket
                        </Button>
                        <p className="text-xs text-gray-400 text-center mt-2">
                          Tiket yang sudah ditutup tidak dapat dibuka kembali
                        </p>
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
      
      {/* Create Ticket Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setFormData({ category: '', description: '' }); }}
        title="Buat Tiket Baru"
        onConfirm={handleCreateTicket}
        confirmText="Kirim Tiket"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Pilih Kategori</option>
            <option value="Akademik">📚 Akademik</option>
            <option value="Teknis">💻 Teknis</option>
            <option value="Administrasi">📋 Administrasi</option>
            <option value="Lainnya">❓ Lainnya</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Jelaskan masalah Anda secara detail..."
            required
          />
          <p className="text-xs text-gray-400 mt-1">Minimal 5 karakter, maksimal 1000 karakter</p>
        </div>
      </Modal>
      
      {/* Confirm Close Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => { setConfirmModalOpen(false); setPendingCloseId(null); }}
        title="Tutup Tiket"
        onConfirm={handleCloseTicket}
        confirmText="Ya, Tutup Tiket"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-2xl text-yellow-600"></i>
          </div>
          <p className="text-gray-600">Apakah Anda yakin ingin menutup tiket ini?</p>
          <p className="text-gray-400 text-sm mt-2">Tiket yang sudah ditutup tidak dapat dibuka kembali.</p>
        </div>
      </Modal>
    </div>
  );
};

export default MahasiswaDashboard;