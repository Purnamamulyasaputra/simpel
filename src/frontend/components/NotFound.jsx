import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-center max-w-lg">
                <div className="mb-8">
                    <div className="text-8xl font-bold text-gray-900 mb-2">404</div>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-3">Halaman Tidak Ditemukan</h1>
                <p className="text-gray-500 mb-8">
                    Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
                </p>
                <Link to="/" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-sm" >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}