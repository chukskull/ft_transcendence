import { io } from "socket.io-client";
import style from "@/styles/SPA/game/game.module.scss";
import React, { useEffect, useState } from "react";
import Matter, { Engine, Render, World, Bodies, Body, Events } from "matter-js";



const GameInstance = () => {
	const [engine, setEngine] = useState<Engine>();
	const [render, setRender] = useState<Render>();
	const [player1PaddleY, setPlayer1PaddleY] = useState(210);
	const [player2PaddleY, setPlayer2PaddleY] = useState(210);
	const [ball, setBall] = useState<Body>();
	const [socket, setSocket] = useState<any>();
	const [player1Score, setPlayer1Score] = useState(0);
	const [Player2Score, setPlayer2Score] = useState(0);

	useEffect(() => {
		const engine = Engine.create();
		const render = Render.create({
			element: document.body,
			engine: engine,
			options: {
				width: 860,
				height: 500,
				/*
				When wireframes are set to true, the physics bodies are displayed as wireframes, which can be useful for debugging and testing purposes. When wireframes are set to false, the physics bodies are hidden and only the filled shapes are displayed.
				*/
				wireframes: false,
			},
		});

		const paddle1 = Bodies.rectangle(10, player1PaddleY, 13, 110, {
			isStatic: true,
			render: {
				fillStyle: "white",
			},
		});

		const paddle2 = Bodies.rectangle(850, player2PaddleY, 13, 110, {
			isStatic: true,
			render: {
				fillStyle: "white",
			},
		});

		const ball = Bodies.rectangle(417, 240, 32, 32,{
			render: {
				fillStyle: "white",
			},
		});

		const topWall = Bodies.rectangle(430, 0, 860, 10, {
			isStatic: true,
			render: {
				fillStyle: "white",
			},
		});

		const bottomWall = Bodies.rectangle(860, 600, 860, 20, {
			isStatic: true,
			render: {
				fillStyle: "white",
			},
		});

		const leftWall = Bodies.rectangle(0, 300, 20, 600, {
			isStatic: true,
			render: {
				fillStyle: "white",
			},
		});

		const rightWall = Bodies.rectangle(800, 300, 20, 600, {
			isStatic: true,
			render: {
				fillStyle: "white",
			},
		});

		const socket = io();


		socket.on("connect", () => {
			console.log("Connected to server");
			socket.emit("createGame");
		});

		socket.on("sendPaddleState", (data: any) => {
			setPlayer2PaddleY(data.y);
		});

		socket.on("updateBallState", (data: any) => {
			Body.setPosition(ball, { x: data.x, y: data.y });
		});

		Events.on(engine, "collisionStart", (event) => {
			event.pairs.forEach((collision) => {
				const { bodyA, bodyB } = collision;

				// Check if the collision is between the ball and a paddle
				if (
					(bodyA === ball && bodyB === paddle1) ||
					(bodyA === paddle1 && bodyB === ball) ||
					(bodyA === ball && bodyB === paddle2) ||
					(bodyA === paddle2 && bodyB === ball)
				) {
					// Reverse the ball's x-velocity to simulate a bounce
					Body.setVelocity(ball, {
						x: -ball.velocity.x,
						y: ball.velocity.y,
					});

					// Emit an event to update the ball's position on the other player's screen
					socket.emit("updateBallState", {
						x: ball.position.x,
						y: ball.position.y,
					});
				}
			});
		});

		socket.on("updateScore", (data: any) => {
			setPlayer1Score(data.player1Score);
			setPlayer2Score(data.player2Score);
		});

		World.add(engine.world, [
			paddle1,
			paddle2,
			ball,
			topWall,
			bottomWall,
			leftWall,
			rightWall,
		]);

		Matter.Runner.run(engine);
		Render.run(render);

		return () => {
			Render.stop(render);
			World.clear(engine.world, false);
			Engine.clear(engine);
		};
	}, []);
};