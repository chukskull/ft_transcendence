import Image from "next/image";
import ButtonNav from "@/components/main/atoms/ButtonNav";

// import CustomButton from "./CustomButton";

interface NavBarProps {
  boolBut: boolean;
}
const NavBar = ({ boolBut }: NavBarProps) => (
  <div className="wrapper-header">
    <div className="wrapper flex items-center justify-between">
      <a href="#" className="Header-Logo">
        <div>
          <Image
            src="/assets/main/Navbar/Vector.svg"
            alt="temp-logo"
            width={57}
            height={45}
          />
        </div>
      </a>
      <ul className="Navigation z-10 bg-none">
        {nav.map((nv) => (
          <li className="bg-none" key={nv.name}>
            <a href={nv.href}>{nv.name}</a>
          </li>
        ))}
      </ul>
      {boolBut ? <ButtonNav /> : <span></span>}
    </div>
  </div>
);
const nav = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Team",
    href: "/team",
  },
];
export default NavBar;
