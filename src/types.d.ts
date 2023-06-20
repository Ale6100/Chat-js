import { ObjectId } from 'mongoose';

export interface newMessage {
    user: string,
    message?: string,
    fecha: string,
    hora: string,
    image?: string,
    respuestaGuardada?: {
        authorCapturado: string,
        mensajeCapturado: string,
        imagenCapturada: string
    }
}

export interface savedMessage extends newMessage {
    _id: ObjectId,
    timestamp: number
}
