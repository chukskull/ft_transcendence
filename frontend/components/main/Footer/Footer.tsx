import React from "react";

import CardComponent from "@/components/main/Footer/CardComponent";
import "@/styles/globals.scss";
export const Footer = () => {
  return (
    <>
      <div className="footer-header my-3">
        <h1 className="text-white text-center font-ClashGrotesk-Semibold text-4xl">
          Meet Our Team:
        </h1>
        <div className="mt-6 Footer-wrapper flex items-center justify-center ">
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
    </>
  );
};

const StudentsInfos = [
  {
    name: "Achref Maghous",
    title: "Full Stack Developer",
    img: "/assets/main/Footer/temp.jpg",
    parag:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  },
  {
    name: "Saleh Nagat",
    title: "Software Engineer",
    img: "/assets/main/Footer/temp.jpg",
    parag:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.  ",
  },
  {
    name: "Ahmed El Mountassir",
    title: "Full Stack Developer",
    img:
      "https://cdn.intra.42.fr/users/4c64d229a66a2142250bb8ab0ffacbd7/mountassir.jpg",
    parag:
      "There is no such thing as enough femboys",
  },
];

export default Footer;
