import adminService from "../services/adminService.js"

const register = async (req, res, next) => {
    try {
        const result = await adminService.register(req.body)
        res.status(201).json({
            status: "Register successfully",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await adminService.login(req.body)
        res.status(200).json({
            status: "Login successfully",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const admin = req.admin;
        const result = await adminService.update(admin, req.body)
        res.status(200).json({
            status: "Update successfully",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {

        const idAdmin = parseInt(req.params.id1);
        const result = await adminService.get(idAdmin)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await adminService.getAll()
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        const admin = req.admin
        const result = await adminService.logout(admin)
        res.status(200).json({
            status: "Logout successfully",
            data: result.nama
        })
    } catch (e) {
        next(e);
    }
}

const addPetugas = async (req, res, next) => {
    try {
        const admin = req.admin;
        const result = await adminService.addPetugas(admin, req.body)
        res.status(201).json({
            status: "Add Petugas successfully",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const getPetugas = async (req, res, next) => {
    try {
        const admin = req.admin;
        const idPetugas = parseInt(req.params.id2);
        const result = await adminService.getPetugas(admin, idPetugas)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const getAllPetugas = async (req, res, next) => {
    try {
        const admin = req.admin;
        const result = await adminService.getAllPetugas(admin)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const updatePetugas = async (req, res, next) => {
    try {
        const admin = req.admin;
        const idPetugas = parseInt(req.params.id3);
        const result = await adminService.updatePetugas(admin, idPetugas, req.body)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const removePetugas = async (req, res, next) => {
    try {
        const admin = req.admin;
        const idPetugas = parseInt(req.params.id4);
        const result = await adminService.removePetugas(admin, idPetugas)
        res.status(200).json({
            data: "OK"
        })
    } catch (e) {
        next(e);
    }
}

const loginPetugas = async (req, res, next) => {
    try {
        const admin = req.admin;
        const result = await adminService.loginPetugas(admin, req.body)
        res.status(200).json({
            status: "Login Petugas successfully",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const addMhs = async (req, res, next) => {
    try {
        const admin = req.admin;
        const result = await adminService.addMahasiswa(admin, req.body)
        res.status(201).json({
            status: "Add Mahasiswa successfully",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

// const addOrUpdatePasswordMhs = async (req, res, next) => {
//     try {
//         const { nim, password } = req.body
//         const result = await adminService.addOrUpdatePasswordMhs(nim, password)
//         res.status(200).json({
//             status: "Password mahasiswa berhasil ditambahkan/diupdate",
//             data: result
//         })
//     } catch (e) {
//         next(e)
//     }
// }

const getMhs = async (req, res, next) => {
    try {
        const admin = req.admin;
        const idMhs = parseInt(req.params.id5);
        const result = await adminService.getMahasiswa(admin, idMhs)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const getAllMhs = async (req, res, next) => {
    try {
        const admin = req.admin;
        const result = await adminService.getAllMahasiswa(admin)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const updateMhs = async (req, res, next) => {
    try {
        const admin = req.admin;
        const idMhs = parseInt(req.params.id6);
        const result = await adminService.updateMahasiswa(admin, idMhs, req.body)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const removeMhs = async (req, res, next) => {
    try {
        const admin = req.admin;
        const idMhs = parseInt(req.params.id7);
        const result = await adminService.removeMahasiswa(admin, idMhs)
        res.status(200).json({
            data: "OK"
        })
    } catch (e) {
        next(e);
    }
}

const getTiket = async (req, res, next) => {
    try {
        const admin = req.admin;
        const idTiket = parseInt(req.params.id8);
        const result = await adminService.getTiket(admin, idTiket)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const getAllTiket = async (req, res, next) => {
    try {
        const admin = req.admin;
        const result = await adminService.getAllTiket(admin)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

export default {
    register, login, update, get, getAll, logout,
    addPetugas, getPetugas, getAllPetugas, updatePetugas, removePetugas, loginPetugas,
    addMhs, getMhs, getAllMhs, updateMhs, removeMhs, getTiket, getAllTiket
}