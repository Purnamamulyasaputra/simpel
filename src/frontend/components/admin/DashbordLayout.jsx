import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainMenu from './MainMenu.jsx';
import Loading from './Loading.jsx';
import DetailTiket from './DetailTiket.jsx';
import { useLocalStorage } from 'react-use';

export default function DashboardLayout() {
  const [showLoading, setShowLoading] = useState(false);
  const [showDetailTiket, setShowDetailTiket] = useState(false);
  const [selectedTiket, setSelectedTiket] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();
  const [token, _] = useLocalStorage('token', '');
  const [role, __] = useLocalStorage('role', '');

  function removeStorage(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  }

  useEffect(() => {
    if (!token) {
      removeStorage();
      navigate('/login?role=admin', { replace: true });
      return;
    }
    
    if (role !== 'ADMIN') {
      removeStorage();
      navigate('/login?role=admin', { replace: true });
      return;
    }
  }, [token, role, navigate]);

  return <>
    <div className='bg-gray-100 font-sans antialiased'>
      {showLoading && <Loading/>}

      <div className="flex h-screen bg-gray-100 overflow-hidden">  
        <Sidebar
          activePage={activePage}
          onDashboardClick={() => setActivePage('dashboard')}
          onMahasiswaClick={() => setActivePage('mahasiswa')}
          onPetugasClick={() => setActivePage('petugas')}
          onTicketsClick={() => setActivePage('tiket')}
        />
        <div className="flex-1 flex flex-col overflow-y-auto">        
            <Navbar activePage={activePage}/>
            <main className="p-4 lg:p-4 flex-1 bg-gray-100">
                <MainMenu 
                  activePage={activePage} 
                  setShowLoading={setShowLoading} 
                  setShowDetailTiket={setShowDetailTiket}
                  setSelectedTiket={setSelectedTiket}>
                </MainMenu>
                <Outlet/>
            </main> 
        </div>
      </div>

      {showDetailTiket && selectedTiket && (
        <DetailTiket
          tiket={selectedTiket}
          onClose={() => {
            setShowDetailTiket(false);
            setSelectedTiket(null);
          }}
        />
      )}

    </div>
  </>;
}