import Image from "next/image";
import ButtonNav from "@/components/main/atoms/ButtonNav";
import { useEffect, useRef } from "react";

// import CustomButton from "./CustomButton";

interface NavBarProps {
  boolBut?: boolean;
}
const NavBar = ({ boolBut }: NavBarProps) => {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchors = navRef.current?.querySelectorAll("a[href^='#']");

    if (!anchors) return;

    anchors.forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href")?.split("#")[1];

        if (targetId) {
          const targetEl = navRef.current?.querySelector(`#${targetId}`);

          if (targetEl) {
            targetEl.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      });
    });
  }, []);
  return (
    <div className="wrapper-header">
      <div className="wrapper flex items-center justify-between">
        <a href="#" className="Header-Logo">
          <div>
            <Image
              className="img-logo"
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
              <a href={`#${nv.href}`}>{nv.name}</a>
            </li>
          ))}
        </ul>
        <ButtonNav />
      </div>
    </div>
  );
};
const nav = [
  {
    name: "Home",
    href: "Home",
  },
  {
    name: "About",
    href: "About",
  },
  {
    name: "Team",
    href: "Team",
  },
];
export default NavBar;
