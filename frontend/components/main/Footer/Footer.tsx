import React from "react";

import CardComponent from "@/components/main/Footer/CardComponent";

export const Footer = () => {
  return (
    <div className="mt-5">
      <div className="footer-header my-3">
        <h1 className="text-white text-center font-ClashGrotesk-Semibold text-4xl">
          Meet Our Team:
        </h1>
      </div>
      <div className=" Footer-wrapper mb-2">
        {/* <svg
          id="crown1"
          fill="#0f74b5"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 50"
        >
          <polygon
            className="cls-1"
            points="12.7 50 87.5 50 100 0 75 25 50 0 25.6 25 0 0 12.7 50"
          />
        </svg> */}

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
