export default function HeaderPetugas({ currentPetugas, notificationCount, onLogout}) {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <div className="px-4 py-2.5 lg:px-5 lg:py-3 flex justify-between items-center">
                <div className="flex items-center gap-2 lg:gap-2.5">
                    <div className="w-8 h-8 lg:w-9 lg:h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-user-tie text-blue-600 text-sm lg:text-lg"></i>
                    </div>
                    <div>
                        <h1 className="text-base lg:text-lg font-bold text-gray-800">
                            Petugas Dashboard
                        </h1>
                        <p className="text-[10px] lg:text-xs text-gray-500">
                            {currentPetugas.fullName}{" "}
                            <span className="text-gray-400">• {currentPetugas.role}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <i className="fas fa-bell text-gray-400 hover:text-gray-600 cursor-pointer text-base lg:text-lg"></i>
                        <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center">
                            {notificationCount}
                        </span>
                    </div>

                    <button onClick={onLogout} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition shadow-md text-xs lg:text-sm" >
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}