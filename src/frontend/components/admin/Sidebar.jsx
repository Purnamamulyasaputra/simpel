import { useNavigate } from "react-router-dom";

export default function Sidebar({isOpen, activePage, onDashboardClick, onMahasiswaClick, onPetugasClick, onTicketsClick }) {
    const navigate = useNavigate();

    function handleLogout(){
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login?role=admin')
    }

    return <>
        <div id="sidebar" className={`sidebar-mobile w-[17rem] lg:w-[15rem] bg-white shadow-xl flex-shrink-0 md:translate-x-0 md:relative transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
            {/* Sidebar */}
            <div className="p-5 lg:p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center gap-3 lg:gap-2">
                    <div className="w-10 h-10 lg:w-8 lg:h-8 bg-white/20 rounded-xl flex items-center justify-center">
                        <i className="fas fa-shield-alt text-white text-xl lg:text-lg" />
                    </div>
                    <div>
                        <h1 className="text-xl lg:text-lg font-bold text-white">Admin Panel</h1>
                        <p className="text-xs lg:text-[10px] text-blue-100 mt-1 lg:mt-0.5">HelpDesk System</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-6 lg:mt-4">
                <button
                    onClick={onDashboardClick}
                    data-nav="dashboard" className={`admin-nav flex items-center px-5 py-3 lg:px-4 lg:py-2 mx-2 rounded-lg transition group mb-1 ${activePage === 'dashboard' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
                    <i className={`fas fa-tachometer-alt w-6 lg:text-sm ${activePage === 'dashboard' ? 'text-blue-600' : 'group-hover:text-blue-600'}`} />
                    <span className="ml-2 font-medium lg:text-sm">Dashboard</span>
                </button>
                <button
                    onClick={onMahasiswaClick} 
                    data-nav="mahasiswa" className={`admin-nav flex items-center px-5 py-3 lg:px-4 lg:py-2 mx-2 rounded-lg transition group mb-1 ${activePage === 'mahasiswa' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
                    <i className={`fas fa-user-graduate w-6 lg:text-sm ${activePage === 'mahasiswa' ? 'text-blue-600' : 'group-hover:text-blue-600'}`} />
                    <span className="ml-2 font-medium lg:text-sm">Manajemen Mahasiswa</span>
                </button>
                <button
                    onClick={onPetugasClick}
                    data-nav="petugas" className={`admin-nav flex items-center px-5 py-3 lg:px-4 lg:py-2 mx-2 rounded-lg transition group mb-1 ${activePage === 'petugas' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
                    <i className={`fas fa-user-tie w-6 lg:text-sm ${activePage === 'petugas' ? 'text-blue-600' : 'group-hover:text-blue-600'}`} />
                    <span className="ml-2 font-medium lg:text-sm">Manajemen Petugas</span>
                </button>
                <button
                    onClick={onTicketsClick}
                    data-nav="tiket" className={`admin-nav flex items-center px-5 py-3 lg:px-4 lg:py-2 mx-2 rounded-lg transition group mb-1 ${activePage === 'tiket' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
                    <i className={`fas fa-ticket-alt w-6 lg:text-sm ${activePage === 'tiket' ? 'text-blue-600' : 'group-hover:text-blue-600'}`} />
                    <span className="ml-2 font-medium lg:text-sm">Semua Tiket</span>
                </button>
            </nav>

            {/* Logout */}
            <div className="absolute bottom-5 lg:bottom-4 left-0 right-0 px-5 lg:px-4">
                <div className="border-t border-gray-200 pt-4 lg:pt-3">
                    <button onClick={handleLogout} id="logoutBtn" className="flex items-center gap-3 text-red-500 hover:text-red-700 transition w-full px-3 py-2 lg:py-1.5 rounded-lg hover:bg-red-50">
                        <i className="fas fa-sign-out-alt lg:text-sm" />
                        <span className="font-medium lg:text-sm">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </>;
}