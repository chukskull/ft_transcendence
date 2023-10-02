"use client";
import React from "react";
import { Avatar } from "@nextui-org/react";

export interface CardComponentProps {
  id?: number;
  image: string;
  name: string;
  title: string;
  text: string;
}
export const CardComponent = ({
  id,
  image,
  name,
  title,
  text,
}: CardComponentProps) => {
  return (
    <div className="Card">
      <Avatar isBordered src={image} className="w-44 h-44 " />
      <h1>{name}</h1>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
};

export default CardComponent;
