import style from "@/styles/SPA/chat/chat.module.scss";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import {
  AiOutlineUserAdd,
  AiOutlineIssuesClose,
  AiOutlineSound,
} from "react-icons/ai";
import ProfileComp from "@/components/SPA/Profile/molecules/ProfileComp";
import { useState } from "react";
const InviteSection = ({}) => {
  return (
    <div className={style["invite-section"]}>
      <h1>
        <AiOutlineUserAdd />
        Invite Friends
      </h1>
      <input
        type="text"
        placeholder="Type the username to search for a friend"
      />

      <div className={style["invite-list"]}>
        <div className={style["friend"]}>
          <ProfileComp
            img="https://i.pravatar.cc/300?img=1"
            nickName="hamza_lkr"
            firstName="Le mountassir"
            lastName="fatFaggot"
          />
          <button>
            <AiOutlineUserAdd />
            Invite
          </button>
        </div>
        <div className={style["friend"]}>
          <ProfileComp
            img="https://i.pravatar.cc/300?img=1"
            nickName="hamza_lkr"
            firstName="Transgender"
            lastName="Nagat"
          />
          <button>
            <AiOutlineUserAdd />
            Invite
          </button>
        </div>
        <div className={style["friend"]}>
          <ProfileComp
            img="https://i.pravatar.cc/300?img=1"
            nickName="hamza_lkr"
            firstName="Achref"
            lastName="Femboy"
          />
          <button>
            <AiOutlineUserAdd />
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};
const AuthoritySection = ({}) => {
  return (
    <div className={style["authority-section"]}>
      <h2>Owners</h2>
      <ProfileComp
        img="https://i.pravatar.cc/300?img=1"
        nickName="hamza_lkr"
        firstName="Saleh"
        lastName="Nagat"
      />
      <h2>Moderators</h2>
      <div className={style["list"]}>
        {[...Array(10)].map((e, i) => (
          <ProfileComp
            key={i}
            img="https://i.pravatar.cc/300?img=1"
            nickName="hamza_lkr"
            firstName="Saleh"
            lastName="Nagat"
          />
        ))}
      </div>
    </div>
  );
};

const MembersSection = ({}) => {
  return (
    <div className={style["members-section"]}>
      <h2>Members</h2>
      <div className={style["members-list"]}>
        {[...Array(222)].map((e, i) => (
          <div className={style["member"]} key={""}>
            <ProfileComp
              key={i}
              img="https://i.pravatar.cc/300?img=1"
              nickName="hamza_lkr"
              firstName="Saleh"
              lastName="Nagat"
            />
          </div>
        ))}
      </div>
      <div className={style["total"]}>Total: 33</div>
    </div>
  );
};

const ChannelSettings = ({}) => {
  return (
    <div className={style["channel-settings"]}>
      <div className={style["channel-type"]}>
        <div>
          <h2>Channel Privacy</h2>
          <div className={style["prv-options"]}>
            <div className={style["privacy"]}>
              <input
                type="radio"
                name="privacy"
                id="public"
                className={style["radio-input"]}
              />
              <label className={style["radio-label"]}>Public</label>
            </div>
            <div className={style["privacy"]}>
              <input
                type="radio"
                name="privacy"
                id="private"
                className={style["radio-input"]}
              />
              <label className={style["radio-label"]}>Private</label>
            </div>
          </div>
        </div>
        <div>
          <h2>Set Password</h2>
          <div className={style["password"]}>
            <input type="password" placeholder="New Password" />
          </div>
        </div>
      </div>
      <div className={style["punished-group"]}>
        <div className={style["banned"]}>
          <h2>Banned</h2>
          <div className={style["list"]}>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>
                <AiOutlineIssuesClose />
              </button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>
                <AiOutlineIssuesClose />
              </button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>
                <AiOutlineIssuesClose />
              </button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>
                <AiOutlineIssuesClose />
              </button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>
                <AiOutlineIssuesClose />
              </button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>
                <AiOutlineIssuesClose />
              </button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>
                <AiOutlineIssuesClose />
              </button>
            </div>
          </div>
        </div>
        <div className={style["muted"]}>
          <h2>Muted</h2>
          <div className={style["list"]}>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>
                <AiOutlineSound />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={style["btns"]}>
        <button>Delete Channel</button>
        <button>Save Changes</button>
      </div>
    </div>
  );
};

const ChannelMenu = ({}) => {
  const [activeSection, setActiveSection] = useState<string>("Invite");

  const handleButtonClick = (sectionName: string) => {
    setActiveSection(sectionName);
  };

  return (
    <>
      <div className={style["menu-header"]}>
        <h1>#Channel Title</h1>
        <div className={style["menu-list"]}>
          <button onClick={() => handleButtonClick("Invite")}>Invite</button>
          <button onClick={() => handleButtonClick("Authority Hub")}>
            Authority Hub
          </button>
          <button onClick={() => handleButtonClick("Members")}>Members</button>
          <button onClick={() => handleButtonClick("Settings")}>
            Settings
          </button>
        </div>
      </div>
      <div className={style["menu-body"]}>
        {activeSection === "Invite" && <InviteSection />}
        {activeSection === "Authority Hub" && <AuthoritySection />}
        {activeSection === "Members" && <MembersSection />}
        {activeSection === "Settings" && <ChannelSettings />}

      </div>
    </>
  );
};

export default ChannelMenu;
