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
    img: "https://imgur.com/a1hqc0G.jpg",
    parag: "Only available for girls under 12 years old (optional 15).",
  },
  {
    name: "Saleh Nagat",
    title: "Software Engineer",
    img: "https://imgur.com/x0IAtXw.jpg",
    parag:
      "Iam dating mums and milfs , Only open for sweet girls and if u are a male more female then dounia batema (Debatable)",
  },
  {
    name: "Ahmed El Mountassir",
    title: "Full Stack Developer",
    img: "https://cdn.intra.42.fr/users/4c64d229a66a2142250bb8ab0ffacbd7/mountassir.jpg",
    parag: "There is no such thing as enough femboys",
  },
];

export default Footer;
