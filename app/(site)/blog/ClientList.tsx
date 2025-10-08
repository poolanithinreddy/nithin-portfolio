"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import ClientRealtime from "./ClientRealtime";

type ClientListProps = {
  channel?: string;
};

export default function ClientList({ channel = "posts-realtime" }: ClientListProps) {
  const router = useRouter();
  const onInsert = useCallback(() => {
    router.refresh();
  }, [router]);

  return <ClientRealtime onInsert={onInsert} channelName={channel} key={channel} />;
}
