import styled from "@emotion/styled";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";

export default function IndexPage() {
  return (
    <>
      <Title>Tools and Technologies Research guide</Title>
      <Subtitle>
        An all in one platform empowering users with powerful visualisations and
        analytics for better, informed choice of tools and technologies. Whether
        you're thinking what to learn, teach or just use, here you will be able
        to find answers based on data coming straight from job posts, from what
        the industry needs and uses.
      </Subtitle>
      <Footer>
        Developed by{" "}
        <Link href="https://github.com/beeinger" target="_blank">
          <BsGithub />
          beeinger
        </Link>{" "}
        , launching Q2 2023
      </Footer>
    </>
  );
}

const Title = styled.h1`
  font-size: 6rem;

  /* Phone screen */
  @media (max-width: 600px) {
    font-size: 3.5rem;
  }

  margin-top: 10%;
  margin-left: 16px;
  max-width: 90%;
`;

const Subtitle = styled.h2`
  font-size: 2rem;

  /* Phone screen */
  @media (max-width: 600px) {
    font-size: 1rem;
  }

  margin-top: 10%;
  margin-left: 16px;
  max-width: 90%;
`;

const Footer = styled.footer`
  font-size: 1rem;

  /* Phone screen */
  @media (max-width: 600px) {
    font-size: 0.8rem;
  }

  margin-left: 16px;
  position: fixed;
  bottom: 16px;

  display: flex;
  align-items: center;

  > a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #4d4dff;

    svg {
      margin: 0 8px;
      height: 1em;
      margin-top: -4px;
    }
  }
`;
