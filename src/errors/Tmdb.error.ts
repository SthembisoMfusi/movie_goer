class TMdbError extends Error {
    constructor(public status: number, message: string){
        super(message);
        this.name = 'TmdbError';
    }
}

module.exports = TMdbError;