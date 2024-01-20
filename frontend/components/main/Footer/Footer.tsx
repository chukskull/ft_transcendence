import React from "react";

import CardComponent from "@/components/main/Footer/CardComponent";

export const Footer = () => {
  return (
    <div className="mt-5">
      <div className="footer-header my-3">
        <h1 className="text-fontlight text-center font-ClashGrotesk-Semibold text-4xl">
          Meet Our Team:
        </h1>
      </div>
      <div className=" Footer-wrapper mb-2">
        {StudentsInfos.map((student, index) => (
          <CardComponent
            key={index}
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
    name: "Achraf Maghous",
    title: "Full Stack Developer",
    img: "https://imgur.com/a1hqc0G.jpg",
    parag:
      " I code with a mission: Make tech accessible, build community, and empower everyone to achieve greatness. Join me on the journey, and together we can change the world.",
  },
  {
    name: "Saleh Nagat",
    title: "Software Engineer",
    img: "https://imgur.com/x0IAtXw.jpg",
    parag:
      "I am a software engineer who is passionate about making open-source more accessible, creating technology to elevate people, and building community, my goal is achieve greatness , family man",
  },
  {
    name: "Ahmed El Mountassir",
    title: "Full Stack Developer",

    img: "https://avatars.githubusercontent.com/u/49590486?s=400&u=62f724f6350cb04749e80f7b33ab4575bfd8890d",
    parag: "I am full stack developer, I love coding and I love my family ",
  },
  {
    name: "Issam Elmakhfi",
    title: "Cyber Security",

    img: "https://i.ibb.co/qnW56DW/Untitled-design.png",
    parag:
      "I find joy in enhancing security measures, ensuring safety, and protecting digital environments.",
  },
];

export default Footer;
