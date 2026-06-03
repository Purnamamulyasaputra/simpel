// Login Mahasiswa
export const mhsLogin = async (data) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mahasiswa/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId: data.nim, password: data.password })
    });
};

// Mendapatkan data mahasiswa yang sedang login
export const mhsCurrent = async (token) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mahasiswa/current`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
};

// Mendapatkan semua tiket milik mahasiswa
export const getMyTickets = async (token) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mahasiswa/tickets`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
};

// Mendapatkan detail tiket berdasarkan ID
export const getTicketById = async (token, ticketId) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mahasiswa/tickets/${ticketId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
};

// Mengirim data message
export const addMessage = async (token, ticketId, message) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mahasiswa/tickets/${ticketId}/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ content: message })
    });
};



// Membuat tiket baru
export const createTicket = async (token, data) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mahasiswa/tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(data)
    });
};

// Menutup tiket (close ticket)
export const closeTicket = async (token, ticketId) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mahasiswa/tickets/${ticketId}/close`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
};

// Logout mahasiswa
export const mhsLogout = async (token) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mahasiswa/logout`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
};