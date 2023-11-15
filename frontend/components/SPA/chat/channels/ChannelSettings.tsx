import style from "@/styles/SPA/chat/chat.module.scss";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import { Switch } from "@nextui-org/react";
import axios from "axios";
import { AiOutlineIssuesClose, AiOutlineSound } from "react-icons/ai";
import { useState } from "react";

const ChannelSettings = ({ banned, muted, id, chPrivate }: any) => {
  const [is_private, setPrivate] = useState(chPrivate);
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({ is_private, password, id: id });
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `http://localhost:1337/channel/update/`,
        formData
      );
      console.log("Update successful", response.data);
    } catch (error) {
      console.error("Error updating channel", error);
    }
  };

  const unban = (userId: number) => {
    axios
      .post(`http://localhost:1337//api/channels/${id}/banning/${userId}/0`) //0 to unban 1 to ban
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
  const unmute = (userId: number) => {
    axios
      .post(`http://localhost:1337//api/channels/${id}/muting/${userId}/0`) //0 to unmute 1 to mute
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
  const deleteChannel = (channelId: number) => {
    axios
      .delete(`http://localhost:1337/api/channels/delete/${channelId}`)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
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
                  onValueChange={() => setPrivate(!is_private)}
                  isSelected={is_private}
                />
                Public
              </div>
              <div className={style["privacy"]}>
                <Switch
                  color="danger"
                  onValueChange={() => setPrivate(!is_private)}
                  isSelected={!is_private}
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
                minLength={4}
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
              {banned?.map((e: any) => (
                <div className={style["user"]}>
                  <AvatarBubble avatar={e.avatarUrl} online />
                  <div className={style["friend-name"]}>{e.nickName}</div>
                  <button onClick={() => unban(e.id)}>
                    <AiOutlineIssuesClose />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={style["muted"]}>
            <h2>Muted</h2>
            <div className={style["list"]}>
              {muted?.map((e: any) => (
                <div className={style["user"]}>
                  <AvatarBubble avatar={e.avatarUrl} online />
                  <div className={style["friend-name"]}>{e.nickName}</div>
                  <button onClick={() => unmute(e.id)}>
                    <AiOutlineSound />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={style["btns"]}>
          <button onClick={() => deleteChannel(id)}>Delete Channel</button>
          <button type="submit">Save Changes</button>
        </div>
      </div>
    </form>
  );
};

export default ChannelSettings;
