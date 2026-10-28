"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader } from "@mantine/core";

export type GoldButtonSize = "xs" | "sm" | "md" | "lg";

export interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  size?: GoldButtonSize;
}

export const GoldButton = forwardRef<HTMLButtonElement, GoldButtonProps>(
  (
    {
      children,
      leftSection,
      rightSection,
      loading = false,
      fullWidth = false,
      size = "md",
      disabled = false,
      type = "button",
      className = "",
      style,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const loaderSize = size === "xs" ? 12 : size === "sm" ? 14 : size === "lg" ? 18 : 16;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`gold-slide-btn size-${size} ${fullWidth ? "full-width" : ""} ${className}`.trim()}
        style={style}
        {...props}
      >
        <span className="gold-slide-bg" />
        <span className="gold-slide-content">
          {loading ? (
            <span className="gold-slide-icon">
              <Loader size={loaderSize} color="currentColor" />
            </span>
          ) : leftSection ? (
            <span className="gold-slide-icon">{leftSection}</span>
          ) : null}
          <span>{children}</span>
          {!loading && rightSection ? (
            <span className="gold-slide-icon">{rightSection}</span>
          ) : null}
        </span>
      </button>
    );
  },
);

GoldButton.displayName = "GoldButton";
