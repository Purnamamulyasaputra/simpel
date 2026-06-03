import { NavLink, useNavigate } from 'react-router-dom';
import Loading from './Loading.jsx';
import '../../lib/style/login.css';
import { useState } from "react";
import { useLocalStorage } from "react-use";
import { adminLogin } from '../lib/scripts/admin/api.js';
import { petugasLogin } from '../lib/scripts/petugas/api.js';
import { alertError } from '../lib/scripts/alert.js';

export default function LoginAdmin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [_, setToken] = useLocalStorage('token', '');
    const [__, setRoleStorage] = useLocalStorage('role', '');
    const [___, setUserId] = useLocalStorage('userId', '');

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            let response;

            if (role === "admin") {
                response = await adminLogin({ username, password });
            } else {
                response = await petugasLogin({ username, password });
            }

            const responseBody = await response.json();
            console.log(responseBody);

            if (response.status === 200) {
                const token = responseBody.data.token;
                const id = responseBody.data.id;

                setToken(token);
                setUserId(id);
                setRoleStorage(role === "admin" ? "ADMIN" : "PETUGAS");

                setTimeout(() => {
                    setLoading(false);
                    navigate(role === "admin" ? "/dashboard" : "/petugas");
                }, 1000);
            } else {
                setLoading(false);
                await alertError(responseBody.errors);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            await alertError("Terjadi kesalahan, silakan coba lagi");
        }
    }

    return (
        <>
            <div className="relative min-h-screen">
                <div className="absolute inset-0 z-0">
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen font-sans">
                        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                            <div className="w-full max-w-md animate-fadeInUp">
                                <div className="glass-effect rounded-2xl shadow-2xl p-8 lg:p-10 backdrop-blur-sm">
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-105 transition-transform">
                                            <i className="fas fa-headset text-white text-3xl" />
                                        </div>
                                        <h1 className="text-2xl font-bold text-gray-800">
                                            Login {role === "admin" ? "Admin" : "Petugas"}
                                        </h1>
                                        <p className="text-gray-500 text-sm mt-1">Sistem Pengaduan dan layanan Mahasiswa</p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <i className="fas fa-users mr-2 text-blue-500" />Login Sebagai
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setRole("admin")}
                                                className={`py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${role === "admin"
                                                        ? "bg-blue-600 text-white shadow-md"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                            >
                                                <i className="fas fa-user-shield" />
                                                <span>Admin</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setRole("petugas")}
                                                className={`py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${role === "petugas"
                                                        ? "bg-green-600 text-white shadow-md"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                            >
                                                <i className="fas fa-user-tie" />
                                                <span>Petugas</span>
                                            </button>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-5">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <i className="fas fa-user mr-2 text-blue-500" />Username
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus-effect transition-all"
                                                    placeholder="Masukkan username"
                                                    required
                                                />
                                                <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <i className="fas fa-lock mr-2 text-blue-500" />Password
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus-effect transition-all"
                                                    placeholder="Minimal 8 karakter"
                                                    required
                                                />
                                                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                <i
                                                    className="fas fa-eye password-toggle absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">* Password minimal 8 karakter</p>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex items-center justify-between">
                                                {role === "admin" && (
                                                    <NavLink
                                                        to='/register'
                                                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                                                    >
                                                        Belum Punya akun?
                                                    </NavLink>
                                                )}

                                                <a
                                                    href="#"
                                                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                                                >
                                                    Lupa password?
                                                </a>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                            disabled={loading}
                                        >
                                            <i className="fas fa-sign-in-alt" />
                                            <span>{loading ? "Memproses..." : "Masuk"}</span>
                                        </button>
                                    </form>
                                </div>

                                <p className="text-center text-xs text-gray-400 mt-6">
                                    © 2026 HelpDesk System
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading && <Loading />}
            </div>
        </>
    );
}