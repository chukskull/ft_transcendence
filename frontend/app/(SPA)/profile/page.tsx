import ProfileComp from "@/components/SPA/Profile/pages/ProfileComp";
import React from "react";

export const Profile = () => {
  return (
    <div>
      {/* NOTICE1 the id is "me" instead of params.slug li kayna f routing example profile/{params.slug} so here {me} reffering to the current session user */}
      <ProfileComp id={"me"} />
    </div>
  );
};
export default Profile;
