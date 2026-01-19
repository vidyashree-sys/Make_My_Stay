class ExpressError extends Error{
    constuctor(statusCode, message){
  
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;