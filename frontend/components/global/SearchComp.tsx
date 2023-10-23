import React, { useState } from "react";
import style from "@/styles/components/TopLeftNav.module.scss";
import { BiSearchAlt } from "react-icons/bi";
import ProfileComp from "../SPA/Profile/molecules/ProfileComp";

const SearchComp = () => {
  const [activeSearch, setActiveSearch] = useState([]);

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setActiveSearch([]);
      return false;
    }

    const filteredUsers = users.filter((user) => {
      const searchValue = e.target.value.toLowerCase();
      const userName = user.firstName.toLowerCase();
      const userLastName = user.lastName.toLowerCase();
      const userNickName = user.nickName.toLowerCase();

      return (
        userName.includes(searchValue) ||
        userLastName.includes(searchValue) ||
        userNickName.includes(searchValue)
      );
    });

    setActiveSearch(filteredUsers.slice(0, 8));
  };

  return (
    <>
      <div className={style["top_search"]}>
        <BiSearchAlt className={style["search_icon"]} />
        <input
          type="text"
          placeholder="Search for players, channels..."
          onChange={(e) => handleSearch(e)}
        />
      </div>
      {activeSearch.length > 0 && (
        <div className="absolute top-20 p-4 bg-black text-white w-[400px] h-auto overflow-auto rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-4">
          {activeSearch.map((user, index) => (
            <span key={index}>
              <ProfileComp
                key={index}
                img={user.img}
                firstName={user.firstName}
                lastName={user.lastName}
                nickName={user.nickName}
              />
            </span>
          ))}
        </div>
      )}
    </>
  );
};

const users = [
  {
    id: 1,
    img: "https://i.pravatar.cc/300?img=1",
    nickName: "blonde",
    firstName: "Hajar",
    lastName: "blondy",
  },
  {
    id: 2,
    img: "https://i.pravatar.cc/300?img=2",
    nickName: "lemntsr",
    firstName: "mountassir",
    lastName: "fat",
  },
  {
    id: 3,
    img: "https://i.pravatar.cc/300?img=3",
    nickName: "hamza_lkr",
    firstName: "Saleh",
    lastName: "Nagat",
  },
  {
    id: 4,
    img: "https://i.pravatar.cc/300?img=4",
    nickName: "CuriousCheetah",
    firstName: "William",
    lastName: "Davis",
  },
  {
    id: 5,
    img: "https://i.pravatar.cc/300?img=5",
    nickName: "TechTitan",
    firstName: "Emily",
    lastName: "Johnson",
  },
  {
    id: 6,
    img: "https://i.pravatar.cc/300?img=6",
    nickName: "CodingQueen",
    firstName: "Hannah",
    lastName: "Miller",
  },
  {
    id: 7,
    img: "https://i.pravatar.cc/300?img=7",
    nickName: "PixelMaster",
    firstName: "Jacob",
    lastName: "Taylor",
  },
  {
    id: 8,
    img: "https://i.pravatar.cc/300?img=8",
    nickName: "DesignDiva",
    firstName: "Olivia",
    lastName: "Moore",
  },
  {
    id: 9,
    img: "https://i.pravatar.cc/300?img=9",
    nickName: "GadgetGuru",
    firstName: "Mason",
    lastName: "Smith",
  },
];
export default SearchComp;
