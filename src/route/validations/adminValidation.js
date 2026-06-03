import Joi from 'joi'

const registerAdminValidation = Joi.object({
    name: Joi.string().min(3).max(30),
    password: Joi.string().min(8),
});

const loginAdminValidation = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required()
})

const updateAdminProfileValidation = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
});

const updateAdminPasswordValidation = Joi.object({
    oldPassword: Joi.string().required().messages({
        'any.required': 'Password lama wajib diisi'
    }),
    password: Joi.string().min(8).max(255).required().messages({
        'string.min': 'Password baru minimal 8 karakter',
        'string.max': 'Password baru maksimal 255 karakter',
        'any.required': 'Password baru wajib diisi'
    })
});

export {
    registerAdminValidation,
    loginAdminValidation,
    updateAdminProfileValidation,
    updateAdminPasswordValidation
}