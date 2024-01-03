import style from "@/styles/SPA/chat/chat.module.scss";
import AvatarBubble from "@/components/SPA/chat/AvatarBubble";
import { Switch } from "@nextui-org/react";
import axios from "axios";
import { AiOutlineIssuesClose, AiOutlineSound } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { on } from "events";

const ChannelSettings = ({ banned, muted, id, chPrivate, onAction }: any) => {
  console.log("these are the muted user", muted);
  const router = useRouter();
  const [is_private, setPrivate] = useState(chPrivate);
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({ is_private, password, id: id });
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    formData.is_private = is_private;
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/update`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        onAction(false);
        router.back();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unban = (userId: number) => {
    console.log("unban", userId);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${id}/banning/${userId}/0`,
        {
          withCredentials: true,
        }
      ) //0 to unban 1 to ban
      .then((res) => {
        onAction(false);
        router.back();
      })
      .catch((err) => console.log(err));
  };
  const unmute = (userId: number) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/${id}/muting/${userId}/0`,
        {
          withCredentials: true,
        }
      ) //0 to unmute 1 to mute
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
  const deleteChannel = (channelId: number) => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/delete/${channelId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        onAction(false);
        router.back();
      })
      .catch((err) => alert(err.response.data));
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
                  isSelected={!is_private}
                />
                Public
              </div>
              <div className={style["privacy"]}>
                <Switch
                  color="danger"
                  onValueChange={() => setPrivate(!is_private)}
                  isSelected={is_private}
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
              {banned?.map((e: any, index: number) => (
                <div key={index} className={style["user"]}>
                  <AvatarBubble avatar={e.avatarUrl} online={e.status} />
                  <div className={style["friend-name"]}>{e.nickName}</div>
                  <button onClick={() => unban(e.id)} type="button">
                    <AiOutlineIssuesClose />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={style["muted"]}>
            <h2>Muted</h2>
            <div className={style["list"]}>
              {muted?.map((e: any, index: number) => (
                <div key={index} className={style["user"]}>
                  <AvatarBubble avatar={e.avatarUrl} online={e.status} />
                  <div className={style["friend-name"]}>{e.nickName}</div>
                  <button onClick={() => unmute(e.id)} type="button">
                    <AiOutlineSound />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={style["btns"]}>
          <button onClick={() => deleteChannel(id)} type="button">
            Delete Channel
          </button>

          <button type="submit">Save Changes</button>
        </div>
      </div>
    </form>
  );
};

export default ChannelSettings;
