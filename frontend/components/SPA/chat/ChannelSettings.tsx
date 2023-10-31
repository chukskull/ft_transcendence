import style from "@/styles/SPA/chat/chat.module.scss";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import { Switch } from "@nextui-org/react";
import axios from "axios";
import {
  AiOutlineUserAdd,
  AiOutlineIssuesClose,
  AiOutlineSound,
} from "react-icons/ai";
import { useState } from "react";

const ChannelSettings = ({}) => {
  const [isPrivate, setPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({ isPrivate, password });

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        "http://localhost:4000/channel",
        formData
      );
      console.log("Update successful", response.data);
    } catch (error) {
      console.error("Error updating channel", error);
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <div className={style["channel-settings"]}>
        <div className={style["channel-type"]}>
          <div>
            <h2>Channel Privacy</h2>
            <div className={style["prv-options"]}>
              <div className={style["privacy"]}>
                <Switch
                  color="success"
                  onValueChange={() => setPrivate(!isPrivate)}
                  isSelected={isPrivate}
                />
                Public
              </div>
              <div className={style["privacy"]}>
                <Switch
                  color="danger"
                  onValueChange={() => setPrivate(!isPrivate)}
                  isSelected={!isPrivate}
                />
                Private
              </div>
            </div>
          </div>
          <div>
            <h2>Set Password</h2>
            <div className={style["password"]}>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormData({ ...formData, password: e.target.value });
                }}
              />
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
          <button type="submit">Save Changes</button>
        </div>
      </div>
    </form>
  );
};

export default ChannelSettings;
