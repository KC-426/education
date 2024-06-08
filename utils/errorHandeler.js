class ErrorHandeler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      console.log(Error);
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default ErrorHandeler;