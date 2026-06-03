import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './lib/style/style.css'
import DashboardLayout from './components/admin/DashbordLayout.jsx'
import MainMenu from './components/admin/MainMenu.jsx'
import RegisterAdmin from './pages/admin/RegisterAdmin.jsx'
import LayoutPetugas from './components/petugas/LayoutPetugas.jsx'
import Login from './components/admin/Login.jsx'
import MahasiswaDashboard from './components/mhs/MahasiswaDashboard.jsx'
import LoginMahasiswa from './components/mhs/LoginMahasiswa.jsx'
import LayoutMahasiswa from './components/mhs/LayoutMahasiswa.jsx'
import NotFound from './components/NotFound.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> 
      <Routes>

        <Route path="/" element={<Navigate to="/mahasiswa" replace/>} />
        <Route path="/register" element={<RegisterAdmin />} />
        <Route path="/login" element={<Login />} />

        <Route path='/dashboard' element={<DashboardLayout/>}>
          <Route index element={<MainMenu />} />
        </Route>

        <Route path='/petugas' element={<LayoutPetugas/>}></Route>

        <Route element={<LayoutMahasiswa/>}>
          <Route path="/mahasiswa/login" element={<LoginMahasiswa />} />
          <Route path="/mahasiswa" element={<MahasiswaDashboard />} />
        </Route>

        <Route path="*" element={<NotFound/>} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
