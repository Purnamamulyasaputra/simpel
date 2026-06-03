import Joi from "joi"

export const loginMahasiswaValidation = Joi.object({
    studentId: Joi.string().max(100).required(),
    password: Joi.string().max(100).required()
})

export const createTicketValidation = Joi.object({
    category: Joi.string().max(100).required(),
    description: Joi.string().min(5).max(1000).required()
})