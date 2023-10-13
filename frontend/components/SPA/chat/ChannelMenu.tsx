import style from "@/styles/SPA/chat/chat.module.scss";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import { AiOutlineUserAdd } from "react-icons/ai";
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
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
          <div className={style["friend-name"]}>Le Mountassir</div>
          <button>
            <AiOutlineUserAdd />
            Invite
          </button>
        </div>
        <div className={style["friend"]}>
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
          <div className={style["friend-name"]}>transgender nagat</div>
          <button>
            <AiOutlineUserAdd />
            Invite
          </button>
        </div>
        <div className={style["friend"]}>
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
          <div className={style["friend-name"]}>femboyachraf</div>
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
      <div className={style["user"]}>
        <AvatarBubble avatar="/assets/components/Profile.svg" online />
        <div className={style["friend-name"]}>Le Mountassir</div>
      </div>
      <h2>Moderators</h2>
      <div className={style["list"]}>
        <div className={style["user"]}>
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
          <div className={style["friend-name"]}>Le Mountassir</div>
        </div>
        <div className={style["user"]}>
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
          <div className={style["friend-name"]}>Le Mountassir</div>
        </div>
        <div className={style["user"]}>
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
          <div className={style["friend-name"]}>Le Mountassir</div>
        </div>
        <div className={style["user"]}>
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
          <div className={style["friend-name"]}>Le Mountassir</div>
        </div>
        <div className={style["user"]}>
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
          <div className={style["friend-name"]}>Le Mountassir</div>
        </div>
        <div className={style["user"]}>
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
          <div className={style["friend-name"]}>Le Mountassir</div>
        </div>
        <div className={style["user"]}>
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
          <div className={style["friend-name"]}>Le Mountassir</div>
        </div>
        <div className={style["user"]}>
          <AvatarBubble avatar="/assets/components/Profile.svg" online />
          <div className={style["friend-name"]}>Le Mountassir</div>
        </div>
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
          <div key={2} className={style["member"]}>
            <AvatarBubble avatar="/assets/components/Profile.svg" online />
            <div className={style["friend-name"]}>Le Mountassir</div>
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
              <button>Unban</button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>Unban</button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>Unban</button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>Unban</button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>Unban</button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>Unban</button>
            </div>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>Unban</button>
            </div>
          </div>
        </div>
        <div className={style["muted"]}>
          <h2>Muted</h2>
          <div className={style["list"]}>
            <div className={style["user"]}>
              <AvatarBubble avatar="/assets/components/Profile.svg" online />
              <div className={style["friend-name"]}>Le Mountassir</div>
              <button>Unmute</button>
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
  return (
    <>
      <div className={style["menu-header"]}>
        <h1>#Channel Title</h1>
        <div className={style["menu-list"]}>
          <button>Invite</button>
          <button>Authority Hub</button>
          <button>Members</button>
          <button>Settings</button>
        </div>
      </div>
      <div className={style["menu-body"]}>
        {/* <InviteSection /> */}
        {/* <AuthoritySection /> */}
        {/* <MembersSection /> */}
        <ChannelSettings />
      </div>
    </>
  );
};

export default ChannelMenu;
