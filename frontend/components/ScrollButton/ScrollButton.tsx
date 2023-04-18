import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ScrollButton({
  type,
  visible,
  ...props
}: {
  type: "left" | "right";
  visible?: boolean;
  onClick: () => void;
}) {
  return visible === false ? null : type === "left" ? (
    <ScrollButtonLeft {...props} />
  ) : (
    <ScrollButtonRight {...props} />
  );
}

const ScrollButtonBase = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  background: none;
  border: none;
  font-size: 2rem;
  color: #fff;
  opacity: 0.5;
  transition: opacity 0.2s ease-in-out;

  user-select: none;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
  }

  &:active {
    opacity: 0.6;
  }
`;

const ScrollButtonLeft = styled(FaChevronLeft)`
  ${ScrollButtonBase}
  left: 8px;
`;

const ScrollButtonRight = styled(FaChevronRight)`
  ${ScrollButtonBase}
  right: 8px;
`;
