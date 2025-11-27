const errorMiddleware = (err, req, res, next) => {
    try {
        let error = {...err};
        error.message = err.message;
        console.log(err);

        //mongoose bad objectId  
        if(err.name === "CastError"){
            const message = "Resource not found";
            error = new Error(message);
            error.statusCode = 404;
        }

        //mongoose duplicate key
        if(err.code === 11000){
            const message = "Duplicate field value entered";
            error = new Error(message);
            error.statusCode = 400;
        }

        //mongoose validation errors
        if (err.name === "ValidationError"){
            const message= Object.values(err.errors).map(value => value.message).join(", ");
            error = new Error(message);
            error.statusCode = 400;
        }

        res.statusCode = error.statusCode || 500;
        res.json({
            success: false,
            message: error.message || "Internal Server Error"
        });

    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;