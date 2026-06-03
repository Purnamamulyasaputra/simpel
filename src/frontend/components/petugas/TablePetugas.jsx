import { useEffect, useState } from "react";
import { addPetugas, AllPetugas, deletePetugas, getPetugas, updatePetugas } from "../../lib/scripts/admin/apiPetugas.js";
import { useLocalStorage } from "react-use";
import { alertError, alertSuccess } from "../../lib/scripts/alert.js";

export default function TablePetugas() {
    const [showPetugasModal, setShowPetugasModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedPetugasId, setSelectedPetugasId] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [token, _] = useLocalStorage('token', '');
    const [dataAllPetugas, setDataAllPetugas] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const [searchTerm, setSearchTerm] = useState("");

    // Filter logic
    const filteredData = dataAllPetugas.filter(petugas => 
        petugas.username && petugas.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    async function submitAddPetugas(e) {
        e.preventDefault();
        const response = await addPetugas(token, {username, password});
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 201) {
            await alertSuccess("add Petugas Successfully.");
            await fetchAllPetugas();
            setShowPetugasModal(false)
        } else {
            await alertError(responseBody.errors)
        }
    }

    async function handleDeletePetugas(idPetugas) {
        const response = await deletePetugas(token, idPetugas);
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 200) {
            await alertSuccess("Deleted Petugas Successfully.");
            await fetchAllPetugas();
        } else {
            await alertError(responseBody.errors)
        }
    }

    async function openEditModal(idPetugas) {
        const response = await getPetugas(token, idPetugas);
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 200) {
            setModalMode("edit");
            setSelectedPetugasId(responseBody.data.id);
            setUsername(responseBody.data.username || "");
            setPassword("");
            setOldPassword("");
            setShowPetugasModal(true)
        } else {
            await alertError(responseBody.errors)
        }
    }
    
    async function submitUpdatePetugas(e) {
        e.preventDefault();

        const response = await updatePetugas(token, {id:selectedPetugasId, username, oldPassword, password });
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 200) {
            await alertSuccess("Update Petugas Successfully.");
            await fetchAllPetugas();
            resetForm();
        } else {
            await alertError(responseBody.errors)
        }
    }

    async function handleSubmitPetugas(e) {
        if(modalMode === "edit"){
            await submitUpdatePetugas(e);
        } else {
            await submitAddPetugas(e);
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

    function openAddModal() {
        setModalMode("add");
        setSelectedPetugasId("");
        setUsername("");
        setPassword("");
        setOldPassword("");
        setShowPetugasModal(true);
    }
    
    function resetForm() {
        setShowPetugasModal(false);
        setModalMode("add");
        setSelectedPetugasId("");
        setUsername("");
        setPassword("");
        setOldPassword("");
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
        if (token){
            fetchAllPetugas();
        }
    }, [token])

    return <>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 lg:gap-2 p-4 lg:p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="font-bold text-lg lg:text-base text-gray-700 shrink-0">
                    <i className="fas fa-user-tie mr-2 text-green-600"></i>Daftar Petugas
                </h3>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input 
                            type="text" 
                            placeholder="Cari Username..." 
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-9 pr-4 py-2 lg:py-1.5 border border-gray-300 rounded-lg text-sm lg:text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                        />
                    </div>
                    <button onClick={openAddModal} id="openAddPetugasModal" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 lg:px-3 lg:py-1.5 rounded-lg text-sm lg:text-xs transition shadow-md whitespace-nowrap">
                        <i className="fas fa-plus mr-1"></i>Tambah Petugas
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">No</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Username</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Dibuat Pada</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Terakhir Update</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Admin Pembuat</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((petugas, index) => (
                            <tr key={petugas.id} className="border-b border-gray-100 table-row-hover text-sm lg:text-xs">
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5">{indexOfFirstItem + index + 1}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5 font-medium">{petugas.username}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5 text-sm lg:text-xs">{formatDate(petugas.createdAt)}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5 text-sm lg:text-xs">{formatDate(petugas.updatedAt)}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5">{petugas.adminName}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5">
                                    <button onClick={() => openEditModal(petugas.id)}  data-id={petugas.id}data-username={petugas.username}className="editPetugasBtn text-blue-500 hover:text-blue-700 mr-3 transition">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button onClick={() => handleDeletePetugas(petugas.id)} data-id={petugas.id} className="deletePetugasBtn text-red-500 hover:text-red-700 transition" >
                                        <i className="fas fa-trash"></i>
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

        {showPetugasModal && (
            <div onClick={resetForm} id="modalPetugas" className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 transition-all duration-200">
                <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all fade-in">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-xl font-bold text-gray-800">{modalMode === "edit" ? "Edit Petugas" : "Tambah Petugas"}</h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600  transition-colors">
                            <i className="fas fa-times text-xl" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmitPetugas} id="formPetugas">
                        <input type="hidden" id="petugasId" />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                            <input type="text" id="petugasUsername" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Masukkan username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>

                        {modalMode === "edit" && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                                <input type="password" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Masukkan password lama" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                            </div>
                        )}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1"> {modalMode === "edit" ? "Password Baru" : "Password"}</label>
                            <input type="password" id="petugasPassword" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required={modalMode === "add"} />
                            <p className="text-xs text-gray-400 mt-1.5"> *Kosongkan jika tidak ingin mengubah password </p>
                        </div>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={resetForm} type="button" className=" px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium">Batal</button>
                            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium">{modalMode === "edit" ? "Update" : "Simpan"}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </>;
}