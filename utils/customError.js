class CustomError extends Error{
    // # Learn how memory is handled when you create a class and when you create a function in js

    constructor (meessage, code){
        super(message);
        this.code = code;
    }
}

export default CustomError