import { Socket } from 'socket.io';

export class Player {
	id: number;
	socket: Socket;
	score: number;
}
