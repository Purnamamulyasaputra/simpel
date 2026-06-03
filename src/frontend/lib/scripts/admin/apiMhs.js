export const addMhs = async (token, {studentId, name, email, birthDate, gender, major, batch, password}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/mhs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            studentId, name, email, birthDate, gender, major, batch, password
        })
    }) 
}

export const getMhs = async (token, id) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/mhs/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }) 
}

export const AllMhs = async (token) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/mhs`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }) 
}

export const updateMhs = async (token, id, {studentId, name, email, birthDate, gender, major, batch, status, oldPassword, password}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/mhs/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            studentId, name, email, birthDate, gender, major, batch, status, oldPassword, password
        })
    }) 
}

export const deleteMhs = async (token, id) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/mhs/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }) 
}