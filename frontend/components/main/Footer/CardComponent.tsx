"use client";
import React from "react";
import { Avatar } from "@nextui-org/react";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
export interface CardComponentProps {
  image: string;
  name: string;
  title: string;
  text: string;
}
export const CardComponent = ({
  image,
  name,
  title,
  text,
}: CardComponentProps) => {
  return (
    <div className="Card">
      <Avatar isBordered src={image} className="footer-avatar" />
      <h1>{name}</h1>
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="flex items-center justify-center space-x-4">
        <AiFillGithub size={50} className="text-fontlight" />
        <AiFillLinkedin size={50} className="text-fontlight" />
      </div>
    </div>
  );
};

export default CardComponent;
