import { io } from "socket.io-client";
import style from "@/styles/SPA/game/game.module.scss";
import React, { useEffect, useState } from "react";
import Matter, { Engine, Render, World, Bodies, Body, Events } from "matter-js";



const GameInstance = () => {
	const [engine, setEngine] = useState<Engine>();
	const [render, setRender] = useState<Render>();
	const [playerPaddleY, setPlayerPaddleY] = useState(210);
	const [EnemyPaddleY, setEnemyPaddleY] = useState(210);
	const [ball, setBall] = useState<Body>();
	const [socket, setSocket] = useState<any>();
	const [player1Score, setPlayer1Score] = useState(0);
	const [EnemyScore, setEnemyScore] = useState(0);

	useEffect(() => {
		const engine = Engine.create();
		const render = Render.create({
			element: document.body,
			engine: engine,
			options: {
				width: 860,
				height: 500,
				wireframes: false,
			},
		});

		const player = Bodies.rectangle(100, playerPaddleY, 20, 100, {
			isStatic: true,
			render: {
				fillStyle: "white",
			},
		});

		const enemy = Bodies.rectangle(700, EnemyPaddleY, 20, 100, {
			isStatic: true,
			render: {
				fillStyle: "white",
			},
		});

		const ball = Bodies.rectangle(417, 240, 10, 10,{
			render: {
				fillStyle: "white",
			},
		});

		const topWall = Bodies.rectangle(400, 0, 800, 20, {
			isStatic: true,
			render: {
				fillStyle: "white",
			},
		});

		const bottomWall = Bodies.rectangle(400, 600, 800, 20, {
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
			socket.emit("joinGame");
		});

		socket.on("sendPaddleState", (data: any) => {
			setEnemyPaddleY(data.y);
		});

		socket.on("ballMoved", (data: any) => {
			Body.setPosition(ball, { x: data.x, y: data.y });
		});

		socket.on("scoreUpdated", (data: any) => {
			setPlayer1Score(data.player1Score);
			setEnemyScore(data.player2Score);
		});

		World.add(engine.world, [
			player,
			enemy,
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