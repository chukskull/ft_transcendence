import { Socket } from 'socket.io';

class Player {
	id: number;
	socket: Socket;
	score: number;
}