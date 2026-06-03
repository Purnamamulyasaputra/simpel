import petugasService from "../services/petugasService.js";

const login = async (req, res, next) => {
    try {
        const result = await petugasService.login(req.body)
        res.status(200).json({
            status: "Login successfully",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {

        const result = await petugasService.get(req.petugas)

        res.status(200).json({
            data: result
        })

    } catch (e) {
        next(e)
    }
}

const logout = async (req, res, next) => {
    try {

        await petugasService.logout(req.petugas)

        res.status(200).json({
            data: "OK"
        })

    } catch (e) {
        next(e)
    }
}

const getTickets = async (req,res,next) => {
    try {
        const result = await petugasService.getTickets()

        res.status(200).json({
            data: result
        })

    } catch(e){
        next(e)
    }
}

const getMessage = async (req,res,next) => {
    try {
        const result = await petugasService.getMessage(parseInt(req.params.id))

        res.status(200).json({
            data: result
        })

    } catch(e){
        next(e)
    }
}

const assignTicket = async (req,res,next) => {
    try {
        const result = await petugasService.assignTicket( req.petugas, parseInt(req.params.id1));
        res.status(200).json({
            data: result
        })

    } catch(e){
        next(e)
    }
}

const addMessage = async (req,res,next) => {
    try {
        const result = await petugasService.addMessage( req.petugas, parseInt(req.params.id1), req.body);
        res.status(200).json({
            data: result
        })

    } catch(e){
        next(e)
    }
}

const resolveTicket = async (req,res,next) => {
    try {
        const result = await petugasService.resolveTicket(req.petugas, parseInt(req.params.id3));
        res.status(200).json({
            data: result
        })

    } catch(e){
        next(e)
    }
}

export default {
    login, get, logout,
    getTickets, getMessage, assignTicket, addMessage, resolveTicket
}