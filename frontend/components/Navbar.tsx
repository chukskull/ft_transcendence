import Link from "next/link";
import Image from "next/image";

// import CustomButton from "./CustomButton";

const NavBar = () => (
  <div className="flex items-center justify-between  padding-x h-full bg-red-500">
    <a href="#" className="Header-Logo">
      <div>
        <Image
          src="/assets/next.svg"
          alt="temp-logo"
          width={100}
          height={100}
        />
      </div>
    </a>
    <ul className="Navigation">
      {nav.map(({ name, href }) => (
        <li key={name}> 
          <a href={href}>
             <a>{name}</a>
          </a>
        </li>
      ))}
    </ul>
    <div>ok sure test zayd l7bibe</div>
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
    name: "team",
    href: "/team",
  },
];
export default NavBar;
