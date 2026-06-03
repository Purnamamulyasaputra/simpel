import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';

export default function LayoutMahasiswa() {
    const [token] = useLocalStorage('mhs_token', '');
    const [role] = useLocalStorage('mhs_role', '');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token && !role === 'MAHASISWA' ) {
            navigate('/mahasiswa/login');
        } 
    }, [token, role, navigate]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Outlet />
        </div>
    );
}