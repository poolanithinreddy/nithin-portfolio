"use client";

import { useEffect } from "react";

import { supabase } from "@/lib/supabase";

type ClientRealtimeProps = {
  onInsert: () => void;
  channelName?: string;
};

export default function ClientRealtime({ onInsert, channelName = "posts-realtime" }: ClientRealtimeProps) {
  useEffect(() => {
    if (!supabase) {
      return;
    }
    const client = supabase;
    const channel = client
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Post" },
        () => onInsert()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [channelName, onInsert]);

  return null;
}
