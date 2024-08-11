class ResponseHandler {
    static success(res, data = null, message = 'Success', statusCode = 200) {
      res.status(statusCode).json({
        success: true,
        message,
        data,
      });
    }
  
    static error(res, statusCode = 500, message = 'An error occurred', error = null) {
      res.status(statusCode).json({
        success: false,
        message,
        error,
      });
    }
  }
  
  export default ResponseHandler; // Ensure you're exporting the class correctly
  