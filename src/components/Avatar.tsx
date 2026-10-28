"use client";

import { memo } from "react";
import { Character, type CharacterConfig } from "@/components/character/Character";
import { DEFAULT_AVATAR } from "@/lib/avatar";

interface Props {
  config?: CharacterConfig | null;
  size?: number;
  /** Head in a circle (chat, navbar, lists) or the whole body. */
  variant?: "bust" | "full";
  /** Idle breathing and blinking; off by default for busts, which appear many times. */
  animated?: boolean;
}

/** The user's character. CharacterStyles is rendered once in the root layout, so each SVG skips its own <style>. */
export const Avatar = memo(function Avatar({ config, size = 48, variant = "bust", animated }: Props) {
  const c = config ?? DEFAULT_AVATAR;
  if (variant === "full") return <Character config={c} size={size} staticPose={animated === false} withStyles={false} />;
  return (
    <span
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        display: "inline-grid",
        placeItems: "end center",
        borderRadius: "50%",
        overflow: "hidden",
        background: "#1e293b",
      }}
    >
      <Character config={c} view="head" size={size * 0.98} staticPose={!animated} withStyles={false} />
    </span>
  );
});
