class TMdbError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'TMdbError'; 
        Object.setPrototypeOf(this, TMdbError.prototype);
    }
}

export default TMdbError;