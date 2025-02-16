class ApiResponse {
    constructor(statusCode, message, data, flag) {
        this.statusCode = statusCode || 200;
        this.message = message || "Success";
        this.data = data;
        this.flag = flag;
    }
}

export {ApiResponse};