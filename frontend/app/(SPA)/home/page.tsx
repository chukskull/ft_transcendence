"use client";

import { MatchMaking } from "@/components/SPA/home/molecules/MatchMaking";
import { SocialFeed } from "@/components/SPA/home/organisms/SocialFeed";

export default function Home() {
  return (
    <div className="flex flex-col justify-center h-auto w-auto lg:h-screen">
      <SocialFeed />
    </div>
  );
}
