import { ResponseError } from "../errors/responseError.js";

export const errMiddleware = async(err, req, res, next) => {
    if (!err){
        next();
        return;
    } 

    if (err instanceof ResponseError) {
        res.status(err.status).json({
            errors: err.message
        }).end();
    } else {
        res.status(500).json({
            errors: err.message
        }).end();
    }
}