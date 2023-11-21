import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const PongGame = () => {
  const [socket, setSocket] = useState(null);
  const [paddlePosition, setPaddlePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newSocket = io('http://localhost:1337'); // Replace with your server URL
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const handleKeyDown = (event) => {
    // Handle arrow key presses to move the paddle
    const speed = 5; // Adjust as needed
    let newX = paddlePosition.x;
    let newY = paddlePosition.y;

    if (event.key === 'ArrowUp') {
      newY -= speed;
    } else if (event.key === 'ArrowDown') {
      newY += speed;
    }

    setPaddlePosition({ x: newX, y: newY });

    // Emit the paddle position to the server
    socket.emit('sendPaddleState', JSON.stringify({ x: newX, y: newY }));
  };

  useEffect(() => {
    if (socket) {
      // Listen for opponent's paddle position update
      socket.on('updateOpponentPaddleState', (opponentPaddleState) => {
        const { x, y } = JSON.parse(opponentPaddleState);
        // Update opponent's paddle position on the frontend
        // Update opponent's paddle position in the game
      });
    }
  }, [socket]);

  return (
    <div tabIndex="0" onKeyDown={handleKeyDown}>
      {/* Render the game canvas and other components */}
    </div>
  );
};

export default PongGame;