export default function Loading(){
    return (
        <div className="fixed inset-0 z-[9999] backdrop-blur-sm bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
                        <i className="fas fa-headset text-white text-4xl"></i>
                    </div>
                </div>
                
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Memuat Sistem...</h2>
                <p className="text-gray-400 text-sm">Mohon tunggu sebentar</p>
                
                <div className="flex justify-center gap-2 mt-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
};