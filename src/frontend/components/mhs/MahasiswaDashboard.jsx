import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import '../../lib/style/mhs.css'

import HeaderMahasiswa from './HeaderMahasiswa';
import KartuStatistik from './KartuStatistik';
import TableTiket from './TableTiket';
import DetailTiket from './DetailTiket';
import ModalBuatTiket from './ModalBuatTiket';
import ModalKonfirmasi from './ModalKonfirmasi';
import { LoadingSpinner, NotificationToast } from './LoadingNotifikasi';

import { getMyTickets, getTicketById, createTicket, closeTicket, addMessage, mhsCurrent } from '../../lib/scripts/mhs/apiMhs';

export default function MahasiswaDashboard() {
    const [token, _] = useLocalStorage('mhs_token', '');
    const [tiketTerpilih, setTiketTerpilih] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notifikasi, setNotifikasi] = useState({ show: false, message: '', type: 'success' });
    const [modalBuatTiket, setModalBuatTiket] = useState(false);
    const [modalKonfirmasi, setModalKonfirmasi] = useState(false);
    const [tiketYangAkanDitutup, setTiketYangAkanDitutup] = useState(null);
    const [namaMhs, setNamaMhs] = useState("");
    const [nimMhs, setNimMhs] = useState("");

    useEffect(() => {
        if(!token) navigate("/mahasiswa/login")
    }, [token])

    const navigate = useNavigate();

    async function getMhs() {
        const response = await mhsCurrent(token);
        const responseBody = await response.json();
        
        if(response.ok){
            setNamaMhs(responseBody.data.name)
            setNimMhs(responseBody.data.studentId)
        } else {
            showNotification(responseBody.errors || 'Terjadi Kesalahan, harap login kembali');
        }
    }
    
    useEffect(() => {
        getMhs();
    }, [token])

    
    // ==================== Helper Functions ====================
    const showNotification = (message, type = 'success') => {
        setNotifikasi({ show: true, message, type });
    };

    const closeNotification = () => {
        setNotifikasi({ ...notifikasi, show: false });
    };

    const fetchTiketSaya = useCallback(async () => {
        try {
            const response = await getMyTickets(token);
            const body = await response.json();
            console.log("data tiket saya:",body)

            if (response.ok) {
                setTiketTerpilih(body.data);
            } else {
                showNotification(body.errors || 'Gagal mengambil data tiket', 'error');
            }
        } catch (error) {
            showNotification('Error', error);
        }
    }, [token]);

    const fetchDetailTiket = async (tiketId) => {
        setLoading(true);
        setTimeout( async() => {
            try {
                const response = await getTicketById(token, tiketId);
                const responseBody = await response.json();
                console.log("Data pesan di mhs", responseBody);
                if (response.ok) {
                    setSelectedTicketId(tiketId);
                    setSelectedTicket(responseBody.data);
                } else {
                    showNotification(responseBody.errors || 'Gagal mengambil detail tiket', 'error');
                }
            } catch (error) {
                showNotification('Error', error);
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    const handleBuatTiket = async (data) => {
        setLoading(true);
        setTimeout( async() => {
            try {
                const response = await createTicket(token, data);
                const body = await response.json();
    
                if (response.status === 200) {
                    showNotification('Tiket berhasil dibuat! Petugas akan segera menangani.', 'success');
                    await fetchTiketSaya();
                } else {
                    showNotification(body.errors || 'Gagal membuat tiket', 'error');
                }
            } catch (error) {
                showNotification('error', error);
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    const handleTutupTiket = async (tiketId) => {
        setLoading(true);

        setTimeout( async() => {
            try {
                const response = await closeTicket(token, tiketId);
                const body = await response.json();
    
                if (response.status === 200) {
                    showNotification(`Tiket #${tiketId} berhasil ditutup`, 'success');
                    await fetchTiketSaya();

                    // Jika tiket yang ditutup sedang dipilih, refresh detailnya
                    if (selectedTicketId === tiketId) {
                        await fetchDetailTiket(tiketId);
                    }
                } else {
                    showNotification(body.errors || 'Gagal menutup tiket', 'error');
                }
            } catch (error) {
                showNotification('error', error);
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    const handleCloseTicketClick = (tiketId) => {
        setTiketYangAkanDitutup(tiketId);
        setModalKonfirmasi(true);
    };

    const confirmCloseTicket = async () => {
        if (tiketYangAkanDitutup) {
            await handleTutupTiket(tiketYangAkanDitutup);
            setModalKonfirmasi(false);
            setTiketYangAkanDitutup(null);
        }
    };

    async function sendMessage(ticketId, message){
        if (!message?.trim()) {
            showNotification('Pesan tidak boleh kosong', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await addMessage(token, ticketId, message);
            const responseBody = await response.json();
            console.log(responseBody);

            if (response.ok) {
                showNotification('Pesan berhasil dikirim', 'success');
                await fetchDetailTiket(ticketId);
            } else {
                showNotification(responseBody.errors || 'Gagal mengirim pesan', 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification('Gagal mengirim pesan', 'error');
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        setTimeout(() => {
            try {
                localStorage.removeItem('mhs_token')
                localStorage.removeItem('mhs_role')
                localStorage.removeItem('mhs_userId')
                navigate('/mahasiswa/login');
                showNotification('Logout berhasil', 'success');
            } catch (error) {
                showNotification('Error', error);
            } finally {
                setLoading(false);
            }
            
        }, 1000);
    };

    const stats = useMemo(() => ({
        totalTikets : tiketTerpilih.length,
        tiketOpen : tiketTerpilih.filter(t => t.status === 'OPEN').length,
        tiketProgress : tiketTerpilih.filter(t => t.status === 'IN_PROGRESS').length,
        tiketSelesai : tiketTerpilih.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
    }), [tiketTerpilih]);

    useEffect(() => {
        if (token) fetchTiketSaya();
    }, [token, fetchTiketSaya]);

    return <>
        <div className="min-h-screen bg-gray-100">
            <HeaderMahasiswa namaMahasiswa={namaMhs} npm={nimMhs} onLogout={handleLogout} />

            <div className="p-3 sm:p-4 lg:p-6">
                <KartuStatistik stats={stats} />

                <div className="mb-3 sm:mb-4 lg:mb-6">
                    <button onClick={() => setModalBuatTiket(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-lg transition shadow-md flex items-center gap-1.5 transform hover:scale-105" >
                        <i className="fas fa-plus-circle text-sm lg:text-base"></i>
                        <span className="font-medium text-xs sm:text-sm">Buat Tiket Baru</span>
                    </button>
                </div>


                <div className="grid lg:grid-cols-2 gap-3 lg:gap-4">
                    <div className={selectedTicketId ? 'hidden lg:block' : 'block'}>
                        <TableTiket
                            dataTiket={tiketTerpilih}
                            selectedTicketId={selectedTicketId}
                            onViewDetail={fetchDetailTiket}
                            onCloseTicket={handleCloseTicketClick}
                        />
                    </div>

                    <div className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col mt-3 lg:mt-0 ${!selectedTicketId ? 'hidden lg:flex' : 'flex'}`}>
                        <div className="p-2.5 sm:p-3 lg:p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-700">
                                    <i className="fas fa-comments mr-1.5 text-blue-600 text-sm"></i>Detail & Percakapan
                                </h3>
                                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                    {selectedTicket ? `Tiket #${selectedTicket.id} - ${selectedTicket.category}` : 'Pilih tiket untuk melihat detail'}
                                </p>
                            </div>
                            {selectedTicketId && (
                                <button 
                                    onClick={() => setSelectedTicketId(null)}
                                    className="lg:hidden text-gray-400 hover:text-gray-600 p-1.5"
                                >
                                    <i className="fas fa-arrow-left text-base"></i>
                                </button>
                            )}
                        </div>
                        <div className="reply-panel flex-1 max-h-[60vh] sm:max-h-[500px] overflow-y-auto">
                            <DetailTiket tiket={selectedTicket} onCloseTicket={handleCloseTicketClick}  onSendMessage={sendMessage} />
                        </div>
                    </div>
                </div>
            </div>

            <ModalBuatTiket
                isOpen={modalBuatTiket}
                onClose={() => setModalBuatTiket(false)}
                onSubmit={handleBuatTiket}
            />

            <ModalKonfirmasi
                isOpen={modalKonfirmasi}
                onClose={() => setModalKonfirmasi(false)}
                onConfirm={confirmCloseTicket}
                pesan="Apakah Anda yakin ingin menutup tiket ini? Tiket yang sudah ditutup tidak dapat dibuka kembali."
            />

            <LoadingSpinner isVisible={loading} />
            <NotificationToast
                isVisible={notifikasi.show}
                message={notifikasi.message}
                type={notifikasi.type}
                onClose={closeNotification}
            />
        </div>
    </>;
}