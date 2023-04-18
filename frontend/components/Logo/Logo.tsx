import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo({
  heightInPx,
  logoType,
  ...props
}: {
  heightInPx?: number;
  logoType?: Icons;
  right?: boolean;
  className?: string;
}) {
  const p = availableIcons[logoType ?? "small"];
  const scale = (heightInPx ?? 64) / p.height;

  return (
    <Link href="/">
      <LogoStyle
        src={p.src}
        alt={"Tools and Technologies Research guide"}
        width={p.width * scale}
        height={p.height * scale}
        {...props}
      />
    </Link>
  );
}

const LogoStyle = styled(Image)<{ right?: boolean }>`
  position: absolute;
  top: 16px;
  cursor: pointer;
  user-select: none;

  ${({ right }) => (right ? "right" : "left")}: 16px;
`;

type Icons = "small" | "large";
type Icon = { width: number; height: number; src: string };

const availableIcons: Record<Icons, Icon> = {
  small: {
    width: 121,
    height: 73,
    src: "/icons/TextLogo.svg",
  },
  large: {
    width: 274,
    height: 73,
    src: "/icons/LongTextLogo.svg",
  },
};
