import React from "react";

import CardComponent from "./CardComponent";

export const Footer = () => {
  return (
    <div className="my-[5rem] footer-header">
      <h1 className="footer-title">Meet Our Team:</h1>
      <div className="Footer-wrapper flex items-center justify-center ">
        {StudentsInfos.map((student, index) => (
          <CardComponent
            key={index}
            id={index}
            image={student.img}
            name={student.name}
            title={student.title}
            text={student.parag}
          />
        ))}
      </div>
    </div>
  );
};

const StudentsInfos = [
  {
    name: "Achref Maghous",
    title: "Full Stack Developer",
    img: "/assets/temp.jpg",
    parag:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  },
  {
    name: "Saleh Nagat",
    title: "Full Stack Developer",
    img: "/assets/temp.jpg",
    parag:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.  ",
  },
  {
    name: "Ahmed El Mountassir",
    title: "Full Stack Developer",
    img: "/assets/temp.jpg",
    parag:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. ",
  },
];

export default Footer;
