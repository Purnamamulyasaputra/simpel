import { useEffect, useState } from "react";
import { addMhs, AllMhs, deleteMhs, getMhs, updateMhs } from "../../lib/scripts/admin/apiMhs.js";
import { alertError, alertSuccess } from "../../lib/scripts/alert.js";
import { useLocalStorage } from "react-use";

export default function TableMhs() {
    const [showMhsModal, setShowMhsModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedMhsId, setSelectedMhsId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [major, setMajor] = useState("");
    const [batch, setBatch] = useState("");
    const [status, setStatus] = useState("");
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [token, _] = useLocalStorage('token', '');
    const [dataAllMhs, setDataAllMhs] = useState([])

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const [searchTerm, setSearchTerm] = useState("");

    // Filter logic
    const filteredData = dataAllMhs.filter(mhs => 
        (mhs.studentId && mhs.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (mhs.name && mhs.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    function confirmDelete(idMhs) {
        setDeleteTargetId(idMhs);
        setShowDeleteConfirm(true);
    }

    async function handleDeleteMhs() {
        const response = await deleteMhs(token, deleteTargetId);
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 200) {
            await alertSuccess("Deleted Mahasiswa Successfully.");
            await fetchAllMhs();
        } else {
            await alertError(responseBody.errors)
        }
        setShowDeleteConfirm(false);
        setDeleteTargetId(null);
    }

    async function submitAddMhs(e) {
        e.preventDefault();
        const response = await addMhs(token, {studentId, name, email, birthDate, gender, major, batch, password, status});
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 201) {
            await alertSuccess("add Mhs Successfully.");
            await fetchAllMhs();
            setShowMhsModal(false)
        } else {
            await alertError(responseBody.errors)
        }
    }

    async function fetchAllMhs() {
        const response = await AllMhs(token);
        const responseBody = await response.json();
        console.log("test: ",responseBody);

        if (response.status === 200) {
            setDataAllMhs(responseBody.data)
        } else {
            await alertError(responseBody.errors)
        }
    }

    async function openEditModal(idMhs) {
        const response = await getMhs(token, idMhs);
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 200) {
            setModalMode("edit");
            setSelectedMhsId(responseBody.data.id);
            setStudentId(responseBody.data.studentId);
            setName(responseBody.data.name);
            setEmail(responseBody.data.email);
            setBirthDate(formatDateIso(responseBody.data.birthDate));
            setGender(responseBody.data.gender);
            setMajor(responseBody.data.major);
            setBatch(responseBody.data.batch);
            setStatus(responseBody.data.status);
            setPassword("");
            setOldPassword("");
            setShowMhsModal(true)
        } else {
            await alertError(responseBody.errors)
        }
    }
  
    async function submitUpdateMhs(e) {
        const isoDate = new Date(birthDate).toISOString();
        e.preventDefault();
        const response = await updateMhs(token, selectedMhsId, { studentId, name, email, birthDate: isoDate, gender, major, batch, status, oldPassword, password });
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 200) {
            await alertSuccess("Update Mahasiswa Successfully.");
            await fetchAllMhs();
            resetForm();
        } else {
            await alertError(responseBody.errors)
        }
    }

    async function handleSubmitMhs(e) {
        if(modalMode === "edit"){
            await submitUpdateMhs(e);
        } else {
            await submitAddMhs(e);
        }
    }

    function openAddModal() {
        setModalMode("add");
        setSelectedMhsId("");
        setStudentId("");
        setName("");
        setEmail("");
        setBirthDate("");
        setGender("");
        setMajor("");
        setBatch("");
        setStatus("");
        setPassword("");
        setOldPassword("");
        setShowMhsModal(true);
    }
    
    function resetForm() {
        setShowMhsModal(false);
        setModalMode("add");
        setSelectedMhsId("");
        setStudentId("");
        setName("");
        setEmail("");
        setBirthDate("");
        setGender("");
        setMajor("");
        setBatch("");
        setStatus("");
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

    const formatDateIso = (iso) => {
        const date = new Date(iso);
        return date.toISOString().split("T")[0];
    };

function getStatus(status) {
    switch (status) {
        case 'ACTIVE':
            return <span className="status-badge status-open">Aktif</span>;
        case 'ON_LEAVE':
            return <span className="status-badge status-progress">Cuti</span>;
        case 'GRADUATED':
            return <span className="status-badge status-resolved">Lulus</span>;
        case 'DROPPED_OUT':
            return <span className="status-badge status-closed">Drop Out</span>;
        default:
            return `-`;
    }
}

    useEffect(() => {
        if (token) {
            fetchAllMhs();
        }
    }, [token])

    return <>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 lg:gap-2 p-4 lg:p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="font-bold text-lg lg:text-base text-gray-700 shrink-0">
                    <i className="fas fa-users mr-2 text-blue-600"></i>Daftar Mahasiswa
                </h3>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input 
                            type="text" 
                            placeholder="Cari NIM atau Nama..." 
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-9 pr-4 py-2 lg:py-1.5 border border-gray-300 rounded-lg text-sm lg:text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                        />
                    </div>
                    <button onClick={openAddModal} id="openAddMhsModal" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 lg:px-3 lg:py-1.5 rounded-lg text-sm lg:text-xs transition shadow-md whitespace-nowrap">
                        <i className="fas fa-plus mr-1"></i>Tambah Mahasiswa
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">No</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Nim</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">nama</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Dibuat Pada</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Terakhir Update</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Admin Pembuat</th>
                            <th className="px-6 py-3 lg:px-4 lg:py-2 text-left text-xs lg:text-[11px] font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((mhs, index) => (
                            <tr key={mhs.id} className="border-b border-gray-100 table-row-hover text-sm lg:text-xs">
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5">{indexOfFirstItem + index + 1}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5 font-medium">{mhs.studentId}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5 font-medium">{mhs.name}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5 font-medium">{getStatus(mhs.status)}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5 text-sm lg:text-xs">{formatDate(mhs.createdAt)}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5 text-sm lg:text-xs">{formatDate(mhs.updatedAt)}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5">{mhs.adminName}</td>
                                <td className="px-6 py-4 lg:px-4 lg:py-2.5">
                                    <button 
                                        onClick={() => openEditModal(mhs.id)}
                                        data-id={mhs.id} 
                                        data-nama={mhs.nama} 
                                        data-email={mhs.email} 
                                        className="editMhsBtn text-blue-500 hover:text-blue-700 mr-3 transition"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button 
                                        onClick={() => confirmDelete(mhs.id)}
                                        data-id={mhs.id} 
                                        className="deleteMhsBtn text-red-500 hover:text-red-700 transition"
                                    >
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
        
        {showMhsModal && (
            <div onClick={resetForm} id="modalMahasiswa" className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 transition-all duration-200 p-4">
                <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl transform transition-all fade-in max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-xl font-bold text-gray-800" id="modalMhsTitle">{modalMode === "add" ? "Tambah Mahasiswa" : "Edit Mahasiswa"}</h3>
                        <button onClick={resetForm} className="closeModalBtn text-gray-400 hover:text-gray-600 transition-colors">
                            <i className="fas fa-times text-xl"/>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmitMhs} id="formMahasiswa">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">NIM <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Masukkan NIM" value={studentId} onChange={(e) => setStudentId(e.target.value)}/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Masukkan nama" value={name} onChange={(e) => setName(e.target.value)}/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                <input type="email" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="email@example.com" value={email ? email : ""} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                                <input type="date" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="">Pilih Jenis Kelamin</option>
                                    <option value="MALE">Laki-laki</option>
                                    <option value="FEMALE">Perempuan</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                                <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" value={major} onChange={(e) => setMajor(e.target.value)}>
                                    <option value="">Pilih Program Studi</option>
                                    <option value="Teknik Mesin">Teknik Mesin</option>
                                    <option value="Teknik Sipil">Teknik Sipil</option>
                                    <option value="Teknik Elektro">Teknik Elektro</option>
                                    <option value="Teknik Informatika">Teknik Informatika</option>
                                </select>                            
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                                <input type="number" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Masukkan tahun angkatan" value={batch} onChange={(e) => setBatch(e.target.value)}/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="">Pilih Status</option>
                                    <option value="ACTIVE">Aktif</option>
                                    <option value="ON_LEAVE">Cuti</option>
                                    <option value="GRADUATED">Lulus</option>
                                    <option value="DROPPED_OUT">Drop Out</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 my-4"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {modalMode === "edit" && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                                    <input type="password" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Masukkan password lama" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                                </div>
                            )}
                            <div className={`mb-4 ${modalMode === "edit" ? "md:col-span-1" : "md:col-span-2"}`}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password {modalMode === "add" && <span className="text-red-500">*</span>}</label>
                                <input type="password" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Minimal 8 karakter" required={modalMode === "add"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                                {modalMode === "edit" && <p className="text-xs text-gray-400 mt-1.5">*Kosongkan jika tidak ingin mengubah password</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                            <button onClick={resetForm} type="button" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium">Batal</button>
                            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium">{modalMode === "edit" ? "Update" : "Simpan"}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {showDeleteConfirm && (
            <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 transition-all duration-200 p-4">
                <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl transform transition-all fade-in text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Konfirmasi Hapus</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Apakah Anda yakin ingin menghapus mahasiswa ini? Data yang sudah dihapus tidak dapat dikembalikan.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => { setShowDeleteConfirm(false); setDeleteTargetId(null); }}
                            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleDeleteMhs}
                            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm font-medium"
                        >
                            <i className="fas fa-trash mr-1"></i>Hapus
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>;
}