import winston from 'winston';

declare global {
    interface MyReq {
        infoPeticion: string;
        logger: winston.Logger;
    }

    namespace Express {
        interface Request extends MyReq {} // Hago que el Request de Express también incluya la interfaz MyReq
    }
}
    