import style from "@/styles/SPA/chat/chat.module.scss";
import axios from "axios";
import { BiLock } from "react-icons/bi";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { on } from "events";

interface CreateChannelModalProps {
  onCreate: (create: boolean) => void;
}

const CreateChannelModal = ({ onCreate }: CreateChannelModalProps) => {
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [is_private, setIsPrivate] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  const handleCreateChannel = async () => {
    if (name.trim() === "") {
      setError("Channel name cannot be empty");
      return;
    }

    if (password.length > 0 && password.length < 5) {
      setError("Password must be at least 5 characters long");
      return;
    }

    setError(null);

    const formData = password
      ? { name, password, is_private }
      : { name, is_private };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/channels/create`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        onCreate(false);
        router.push(`/chat/channels/${res.data.id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <h1>Create Channel</h1>
      <div className={style["input-group"]}>
        <div>
          <label htmlFor="channel-name">Channel Name</label>
          <input
            type="text"
            id="channel-name"
            placeholder="NewChannel"
            value={name}
            maxLength={18}
            onChange={(e) => setname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="channel-paswd">Channel Password (Optional)</label>
          <input
            type="password"
            id="channel-paswd"
            name="channel-paswd"
            placeholder="Set Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            minLength={5}
          />
        </div>
        <div className={style["prv-btn"]}>
          <h3>
            <BiLock />
            Private Channel
          </h3>
          <input
            type="checkbox"
            checked={is_private}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
        </div>
      </div>
      {error && <div className={style["error-message"]}>{error}</div>}
      <button className={style["create-btn"]} onClick={handleCreateChannel}>
        Create
      </button>
    </>
  );
};

export default CreateChannelModal;
