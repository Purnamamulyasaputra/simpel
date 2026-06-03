import { useEffect, useState } from "react";
import { alertError } from "../../lib/scripts/alert.js";
import { adminProfile } from "../../lib/scripts/admin/api.js";
import { useLocalStorage } from "react-use";

export default function Navbar({activePage, }) {
    const [username, setUsername] = useState('');
    const [token] = useLocalStorage('token', '');
    const [id] = useLocalStorage('userId', '');

    const getTitle = () => {
        switch (activePage) {
            case 'dashboard':
                return 'Dashboard Admin';
            case 'mahasiswa':
                return 'Manajemen Mahasiswa';
            case 'petugas':
                return 'Manajemen Petugas';
            case 'tiket':
                return 'Semua Tiket';
            default:
                return 'Admin Panel';
        }
    };

    async function adminGetProfile() {
        const response = await adminProfile({token, id});
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 200){
            setUsername(responseBody.data.name)
        } else {
            await alertError(responseBody.errors)
        }
    }

    useEffect(() => {
        if (token && id){
            adminGetProfile();
        }
    }, [token, id]);

    return (
        <header className="bg-white shadow-sm p-4 lg:p-3 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <button id="mobileMenuBtn" className="md:hidden text-gray-600 text-2xl hover:text-blue-600">
                    <i className="fas fa-bars" />
                </button>
                <h2 className="text-xl lg:text-lg font-semibold text-gray-800" id="pageTitle">{getTitle()}</h2>
            </div>
            <div className="flex items-center gap-4 lg:gap-3">
                <div className="relative">
                    <i className="fas fa-bell text-gray-400 hover:text-gray-600 cursor-pointer text-xl lg:text-lg" />
                    <span className="absolute -top-1 -right-2 w-4 h-4 lg:w-3.5 lg:h-3.5 bg-red-500 rounded-full text-[10px] lg:text-[9px] text-white flex items-center justify-center">3</span>
                </div>
                <div className="flex items-center gap-3 lg:gap-2">
                    <div className="w-10 h-10 lg:w-8 lg:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-blue-600 text-lg lg:text-base" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm lg:text-xs font-semibold text-gray-800">Admin Super</p>
                        <p className="text-xs lg:text-[10px] text-gray-500">{username || "Memuat Username..."}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}