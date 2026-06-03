export const petugasRegister = async ({username, password}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/petugas/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username, password
        })
    }) 
}

export const petugasLogin = async ({username, password}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/petugas/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username, password
        })
    }) 
}

export const petugasGetTiket = async (token) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/petugas/tickets`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }) 
}

export const petugasAssignTiket = async (token, id) => { 
    return await fetch(`${import.meta.env.VITE_API_PATH}/petugas/tickets/${id}/assign`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }) 
}

export const petugasResolveTiket = async (token, id) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/petugas/tickets/${id}/resolve`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }) 
}

export const petugasReplyTiket = async (token, id, message) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/petugas/tickets/${id}/reply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ content: message })
    }) 
}

export const petugasGetMessage = async (token, id) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/petugas/tickets/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    }) 
}
