import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { mhsLogin } from '../../lib/scripts/mhs/apiMhs.js';

export default function LoginMahasiswa() {
    const [nim, setNim] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [_, setToken] = useLocalStorage('mhs_token', '');
    const [__, setRole] = useLocalStorage('mhs_role', '');
    const [___, setUserId] = useLocalStorage('mhs_userId', '');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await mhsLogin({ nim, password });
            const body = await response.json();

            if (response.status === 200) {
                setToken(body.data.token);
                setRole('MAHASISWA');
                setUserId(body.data.id);

                if (rememberMe) {
                    localStorage.setItem('remember', nim);
                } else {
                    localStorage.removeItem('remember');
                }

                navigate('/mahasiswa');
            } else {
                setError(body.errors || 'nama atau password salah');
            }
        } catch (err) {
            setError('Terjadi kesalahan, silakan coba lagi', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const remembered = localStorage.getItem('remember');
        if (remembered) {
            setNim(remembered);
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6">
            <div className="w-full max-w-xs sm:max-w-sm">
                <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm">
                    <div className="text-center mb-5 sm:mb-6">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                            <i className="fas fa-user-graduate text-white text-xl sm:text-2xl"></i>
                        </div>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800">Login Mahasiswa</h1>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Sistem Pengaduan dan layanan Mahasiswa</p>
                    </div>

                    {error && (
                        <div className="mb-3 p-2.5 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs">
                            <i className="fas fa-exclamation-circle mr-1.5"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                <i className="fas fa-user mr-1.5 text-green-500"></i>NIM
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={nim}
                                    onChange={(e) => setNim(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Masukkan NIM"
                                    disabled={loading}
                                />
                                <i className="fas fa-user absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors text-sm"></i>
                            </div>
                        </div>

                        {/* Input Password */}
                        <div className="mb-5">
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                <i className="fas fa-lock mr-1.5 text-green-500"></i>Password
                            </label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Minimal 8 karakter"
                                    disabled={loading}
                                />
                                <i className="fas fa-lock absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors text-sm"></i>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">* Password minimal 8 karakter</p>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm" >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    <span>Masuk</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-gray-400 mt-4">
                    &copy; 2026 HelpDesk System | Multi-User Support System
                </p>
            </div>
        </div>
    );
}