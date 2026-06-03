export const addPetugas = async (token, {username, password}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/petugas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            username, password
        })
    }) 
}

export const getPetugas = async (token, id) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/petugas/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }) 
}

export const AllPetugas = async (token) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/petugas`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
    }) 
}

export const updatePetugas = async (token,{ id, username, oldPassword, password}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/petugas/update/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            username, oldPassword, password
        })
    }) 
}

export const deletePetugas = async (token, id) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/petugas/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }) 
}
   

export const getTiket = async (token, id) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/ticket/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }) 
}

export const getAllTiket = async (token) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/tickets`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }) 
}

export const getMessage = async (token, id) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/petugas/tickets/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }) 
}