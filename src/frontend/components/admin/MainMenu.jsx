import { useEffect, useState } from 'react';
import TableMhs from '../mhs/TableMhs.jsx';
import TablePetugas from '../petugas/TablePetugas.jsx';
import TableTiket from '../tiket/TableTiket.jsx';
import { alertError } from '../../lib/scripts/alert.js';
import { useLocalStorage } from 'react-use';
import { AllMhs } from '../../lib/scripts/admin/apiMhs.js';
import { AllPetugas, getAllTiket, getTiket, getMessage } from '../../lib/scripts/admin/apiPetugas.js';

export default function MainMenu( {activePage, setShowDetailTiket, setSelectedTiket }) { 
    const [token] = useLocalStorage('token', '');
    const [dataAllTiket, setDataAllTiket] = useState([])
    const [dataAllMhs, setDataAllMhs] = useState([])
    const [dataAllPetugas, setDataAllPetugas] = useState([])
    // const [dataMessage, setDataMessage] = useState([])

    async function fetchAllTiket() {
        const response = await getAllTiket(token);
        const responseBody = await response.json();
        console.log("tes",responseBody);

        if (response.status === 200) {
            setDataAllTiket(responseBody.data)
        } else {
            await alertError(responseBody.errors)
        }
    }

    async function handleShowDetail(tiket) {
        try {
            const response = await getTiket(token, tiket.id);
            const responseBody = await response.json();
            if (response.ok) {
                setSelectedTiket(responseBody.data);
            } else {
                setSelectedTiket(tiket);
            }
        } catch {
            setSelectedTiket(tiket);
        }
        setShowDetailTiket(true);
    }

    async function fetchAllMhs() {
        const response = await AllMhs(token);
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 200) {
            setDataAllMhs(responseBody.data)
        } else {
            await alertError(responseBody.errors)
        }
    }

    async function fetchAllPetugas() {
        const response = await AllPetugas(token);
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 200) {
            setDataAllPetugas(responseBody.data)
        } else {
            await alertError(responseBody.errors)
        }
    }

    // async function fetchMessage(tiketId) {
    //     const response = await getMessage(token, tiketId);
    //     const responseBody = await response.json();
    //     console.log("data Pesan", responseBody);

    //     if (response.status === 200) {
    //         setDataMessage(responseBody.data)
    //     } else {
    //         await alertError(responseBody.errors)
    //     } 
    // }

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

    const [stats, setStats] = useState({
        totalMahasiswa: 0,
        totalPetugas: 0,
        totalTickets: 0,
        openTickets: 0,
    });

    useEffect(() => {
        if (token) {
            fetchAllTiket();
            fetchAllMhs();
            fetchAllPetugas();
            // fetchMessage();
        }
    }, [token])
    
    useEffect(() => {
        setStats({
            totalMahasiswa: dataAllMhs.length,
            totalPetugas: dataAllPetugas.length,
            totalTickets: dataAllTiket.length,
            openTickets: dataAllTiket.filter(t => t.status === 'OPEN').length,
        });
    }, [dataAllTiket, dataAllMhs]);

    switch (activePage) {
        case 'dashboard':
            return <>
                <div className="fade-in">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 lg:p-4 mb-6 lg:mb-4 text-white">
                        <h2 className="text-2xl lg:text-xl font-bold mb-2 lg:mb-1">Selamat Datang, Admin!</h2>
                        <p className="text-blue-100 lg:text-sm">Kelola sistem HelpDesk dengan mudah melalui dashboard ini.</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 mb-8 lg:mb-6">
                        <div className="bg-white rounded-xl shadow-md p-5 lg:p-4 card-hover">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm lg:text-xs font-medium">Total Mahasiswa</p>
                                    <p className="text-3xl lg:text-2xl font-bold text-gray-800 mt-1" id="totalMahasiswa">{stats.totalMahasiswa}</p>
                                    <p className="text-xs lg:text-[10px] text-green-500 mt-2 lg:mt-1"><i className="fas fa-arrow-up" /> +12% bulan ini</p>
                                </div>
                                <div className="w-12 h-12 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <i className="fas fa-user-graduate text-2xl lg:text-xl text-blue-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-5 lg:p-4 card-hover">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm lg:text-xs font-medium">Total Petugas</p>
                                    <p className="text-3xl lg:text-2xl font-bold text-gray-800 mt-1" id="totalPetugas">{stats.totalPetugas}</p>
                                    <p className="text-xs lg:text-[10px] text-green-500 mt-2 lg:mt-1"><i className="fas fa-arrow-up" /> +2 aktif</p>
                                </div>
                                <div className="w-12 h-12 lg:w-10 lg:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <i className="fas fa-user-tie text-2xl lg:text-xl text-green-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-5 lg:p-4 card-hover">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm lg:text-xs font-medium">Total Tiket</p>
                                    <p className="text-3xl lg:text-2xl font-bold text-gray-800 mt-1" id="totalTickets">{stats.totalTickets}</p>
                                    <p className="text-xs lg:text-[10px] text-gray-500 mt-2 lg:mt-1">Semua tiket</p>
                                </div>
                                <div className="w-12 h-12 lg:w-10 lg:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <i className="fas fa-ticket-alt text-2xl lg:text-xl text-purple-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-5 lg:p-4 card-hover">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm lg:text-xs font-medium">Tiket Open</p>
                                    <p className="text-3xl lg:text-2xl font-bold text-gray-800 mt-1" id="openTickets">{stats.openTickets}</p>
                                    <p className="text-xs lg:text-[10px] text-yellow-500 mt-2 lg:mt-1">Perlu ditangani</p>
                                </div>
                                <div className="w-12 h-12 lg:w-10 lg:h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <i className="fas fa-clock text-2xl lg:text-xl text-yellow-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Tickets Table */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-4 lg:p-3 border-b border-gray-300 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg lg:text-base text-gray-700">
                                    <i className="fas fa-clock mr-2 text-blue-600" />Tiket Terbaru
                                </h3>
                            </div>
                        </div>  
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">No</th>
                                        <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">NIM</th>
                                        <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Kategori</th>
                                        <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Deskripsi</th>
                                        <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Tanggal</th>
                                        <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataAllTiket.slice(0, 5).map((tiket, index) => (
                                        <tr key={tiket.id} className="border-b border-gray-300 table-row-hover text-sm lg:text-xs">
                                            <td className="px-6 py-4 lg:px-4 lg:py-2.5 font-medium">{index + 1}</td>
                                            <td className="px-6 py-4 lg:px-4 lg:py-2.5">{tiket.student?.studentId}</td>
                                            <td className="px-6 py-4 lg:px-4 lg:py-2.5">
                                                <span className="px-2 py-1 lg:py-0.5 rounded-full text-xs lg:text-[10px] font-medium bg-gray-100 text-gray-700">{tiket.category}</span>
                                            </td>
                                            <td className="px-6 py-4 lg:px-4 lg:py-2.5 max-w-xs lg:max-w-[200px] truncate"> {tiket.description.substring(0, 10)} {tiket.description.length > 10 ? '...' : ''} </td>
                                            <td className="px-6 py-4 lg:px-4 lg:py-2.5">
                                                <span className={`status-badge text-xs lg:text-[10px] py-1 lg:py-0.5 ${tiket.status === 'OPEN' ? 'status-open' : tiket.status === 'IN_PROGRESS' ? 'status-progress' : 'status-resolved'}`}>
                                                    {tiket.status === 'OPEN' ? 'Open' : tiket.status === 'IN_PROGRESS' ? 'In Progress' : 'Resolved'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 lg:px-4 lg:py-2.5 text-sm lg:text-[11px]">{formatDate(tiket.createdAt)}</td>
                                            <td className="px-6 py-4 lg:px-4 lg:py-2.5">
                                                <button onClick={() => handleShowDetail(tiket)}
                                                        className="viewTicketBtn text-blue-600 hover:text-blue-800 text-sm lg:text-xs flex items-center gap-1" data-id={tiket.id}>
                                                    <i className="fas fa-eye"></i> Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>;
        case 'mahasiswa':
            return <>
                <TableMhs/>
            </>;
        case 'petugas':
            return <>
                <TablePetugas/>
            </>;
        case 'tiket':
            return<>
                <TableTiket/>
            </>;
        default:
            break;
    }  
}