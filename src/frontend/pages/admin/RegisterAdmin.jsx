import { NavLink, useNavigate } from 'react-router-dom';
import '../../lib/style/login.css';
import { useState } from "react";
import { alertError, alertSuccess } from '../../lib/scripts/alert.js';
import { adminRegister } from '../../lib/scripts/admin/api.js';

export default function RegisterAdmin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPassword){
            await alertError("Password don't match");
            return;
        }

        const response = await adminRegister({username, password});
        const responseBody = await response.json();
        console.log(responseBody);

        if (response.status === 201){
            await alertSuccess("Admin created Successfully");
            navigate ({
                pathname: '/login'
            })

        } else {
            await alertError(responseBody.errors)
        }
    }

    return <>
        <div className="relative min-h-screen">

            {/* form register */}
            <div className="absolute inset-0 z-0">
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen font-sans">
                    <div className="min-h-screen flex items-center justify-center px-4 py-6 relative overflow-hidden">
                        <div className="w-full max-w-xs sm:max-w-sm animate-fadeInUp">
                            <div className="glass-effect rounded-2xl shadow-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm">
                                <div className="text-center mb-5 sm:mb-6">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg transform hover:scale-105 transition-transform">
                                        <i className="fas fa-headset text-white text-xl sm:text-2xl" />
                                    </div>
                                    <h1 className="text-lg sm:text-xl font-bold text-gray-800">Register Admin</h1>
                                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Sistem Manajemen Tiket</p>
                                </div>

                                <form onSubmit={handleSubmit}>

                                    <div className="mb-4">
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                            <i className="fas fa-user mr-1.5 text-blue-500" />Username
                                        </label>
                                        <div className="relative group">
                                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus-effect transition-all" placeholder="Masukkan username" required />
                                            <i className="fas fa-user absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors text-sm" />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                            <i className="fas fa-lock mr-1.5 text-blue-500" />Password
                                        </label>
                                        <div className="relative group">
                                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus-effect transition-all" placeholder="Masukkan password" required />
                                            <i className="fas fa-lock absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors text-sm" />
                                            <i className="fas fa-eye password-toggle absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer text-sm" onClick={() => setShowPassword(!showPassword)} />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                            <i className="fas fa-lock mr-1.5 text-blue-500" />Confirm Password
                                        </label>
                                        <div className="relative group">
                                            <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus-effect transition-all" placeholder="Masukkan Confirm password" required />
                                            <i className="fas fa-lock absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors text-sm" />
                                            <i className="fas fa-eye password-toggle absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer text-sm" onClick={() => setShowPassword(!showPassword)} />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-xs">
                                            <NavLink to='/login' className="text-blue-600 hover:text-blue-700 transition-colors hover:underline">Sudah punya akun?</NavLink>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm">
                                        <i className="fas fa-sign-in-alt" />
                                        <span>Daftar</span>
                                    </button>
                                </form>
                            </div>

                            <p className="text-center text-[10px] text-gray-400 mt-4">
                                © 2026 HelpDesk System
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>;
}