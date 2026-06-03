export default function HeaderMahasiswa({ namaMahasiswa, npm, onLogout }) {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <div className="px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-green-100 rounded-lg lg:rounded-xl flex items-center justify-center">
                        <i className="fas fa-user-graduate text-green-600 text-sm lg:text-xl"></i>
                    </div>
                    <div>
                        <h1 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 leading-tight">Mahasiswa Dashboard</h1>
                        <p className="text-[10px] sm:text-xs lg:text-xs text-gray-500 mt-0.5 truncate max-w-[150px] sm:max-w-none">
                            {namaMahasiswa} <span className="text-gray-400">• {npm}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={onLogout} className="flex items-center gap-1.5 lg:gap-2 bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-lg transition shadow-md text-xs lg:text-sm">
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}