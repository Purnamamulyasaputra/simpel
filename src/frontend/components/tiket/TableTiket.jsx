import { useEffect, useState } from "react";
import { getAllTiket, getTiket } from "../../lib/scripts/admin/apiPetugas.js";
import { alertError } from "../../lib/scripts/alert.js";
import { useLocalStorage } from "react-use";
import DetailTiket from "../admin/DetailTiket.jsx";

export default function TableTiket() {
    const [token, _] = useLocalStorage('token', '');
    const [dataAllTiket, setDataAllTiket] = useState([])
    const [showDetailTiket, setShowDetailTiket] = useState(false);
    const [selectedTiket, setSelectedTiket] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const [searchTerm, setSearchTerm] = useState("");

    // Filter logic
    const filteredData = dataAllTiket.filter(tiket => 
        (tiket.student?.name && tiket.student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tiket.category && tiket.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tiket.description && tiket.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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

    async function fetchAllTiket() {
        const response = await getAllTiket(token);
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 200) {
            setDataAllTiket(responseBody.data)
        } else {
            await alertError(responseBody.errors)
        }
    }

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

    useEffect(() => {
        if (token) {
            fetchAllTiket();
        }
    }, [token])

    return <>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 lg:gap-2 p-4 lg:p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="font-bold text-lg lg:text-base text-gray-700 shrink-0">
                    <i className="fas fa-ticket-alt mr-2 text-yellow-600"></i>Semua Tiket
                </h3>
                <div className="relative w-full md:w-72">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input 
                        type="text" 
                        placeholder="Cari Nama, Kategori, atau Deskripsi..." 
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-9 pr-4 py-2 lg:py-1.5 border border-gray-300 rounded-lg text-sm lg:text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">No</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Mahasiswa</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Kategori</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Deskripsi</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Petugas</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Dibuat</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((tiket, index) => (
                            <tr key={tiket.id} className="border-b border-gray-100 table-row-hover text-sm lg:text-xs">
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5 font-medium">{indexOfFirstItem + index + 1}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5">{tiket.student?.name}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5">
                                    <span className="px-2 py-1 lg:py-0.5 rounded-full text-xs lg:text-[10px] font-medium bg-gray-100 text-gray-700">{tiket.category}</span>
                                </td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5 max-w-xs truncate">{tiket.description}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5">
                                    <span className={`status-badge text-xs lg:text-[10px] py-1 lg:py-0.5 ${tiket.status === 'OPEN' ? 'status-open' : tiket.status === 'IN_PROGRESS' ? 'status-progress' : 'status-resolved'}`}>
                                        {tiket.status === 'OPEN' ? 'Open' : tiket.status === 'IN_PROGRESS' ? 'In Progress' : 'Resolved'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5">{tiket.staff?.username || '-'}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5 text-sm lg:text-[11px]">{formatDate(tiket.createdAt)}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5">
                                    <button onClick={() => handleShowDetail(tiket)} className="viewTicketBtn text-blue-600 hover:text-blue-800 flex items-center gap-1" data-id={tiket.id}>
                                        <i className="fas fa-eye"></i> Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="px-6 py-4 lg:px-4 lg:py-3 flex flex-col sm:flex-row gap-3 lg:gap-2 items-center justify-between border-t border-gray-200 bg-gray-50">
                    <span className="text-sm lg:text-xs text-gray-700">
                        Menampilkan <span className="font-medium">{filteredData.length > 0 ? indexOfFirstItem + 1 : 0}</span> sampai <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> dari <span className="font-medium">{filteredData.length}</span> data
                    </span>
                    <div className="flex gap-1">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition ${currentPage === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-sm'}`}
                        >
                            <i className="fas fa-chevron-left text-xs"></i>
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-sm'}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition ${currentPage === totalPages || totalPages === 0 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-sm'}`}
                        >
                            <i className="fas fa-chevron-right text-xs"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>

        {showDetailTiket && selectedTiket && (
            <DetailTiket
                tiket={selectedTiket}
                onClose={() => {
                    setShowDetailTiket(false);
                    setSelectedTiket(null);
                }}
            />
        )}
    </>;
}