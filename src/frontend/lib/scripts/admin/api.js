export const adminRegister = async ({username, password}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: username, password
        })
    }) 
}

export const adminLogin = async ({username, password}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: username, password
        })
    }) 
}

export const adminProfile = async ({token, id}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/admin/current/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }) 
}

// export const adminEditProfile = async (token, {nip, username, name, email, phone}) => {
//     return await fetch(`${import.meta.env.VITE_API_PATH}/admin/update/profile`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Authorization': token
//         },        
//         body: JSON.stringify({
//            nip, username, name, email, phone
//         })
//     }) 
// }

// export const adminEditPassword = async (token, {nip, oldPassword, password}) => {
//     return await fetch(`${import.meta.env.VITE_API_PATH}/admin/update`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': token
//         },        
//         body: JSON.stringify({
//            nip, oldPassword, password
//         })
//     }) 
// }