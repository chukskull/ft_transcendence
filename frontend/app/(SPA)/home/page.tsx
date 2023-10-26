"use client";
import { MatchButton } from "@/components/SPA/home/atoms/MatchButton";
import { LiveGameRec } from "@/components/SPA/home/molecules/LiveGameRec";
import { MatchMaking } from "@/components/SPA/home/molecules/MatchMaking";
import { SocialFeed } from "@/components/SPA/home/organisms/SocialFeed";

export default function Home() {
  return (
    <div className="flex flex-col justify-center h-auto w-auto lg:h-screen">
      <SocialFeed />
      <MatchMaking />
    </div>
  );
}
