import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { BsArrowRight, BsGithub, BsHeartFill } from "react-icons/bs";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";

export default function IndexPage() {
  const router = useRouter(),
    goToSearch = useCallback(() => router.push("/search"), [router.push]);

  return (
    <Container>
      <Body>
        <Title>
          <b>T</b>ools and <b>T</b>echnologies <b>R</b>esearch <b>guide</b>
        </Title>
        <div>
          <Subtitle>
            An all in one platform empowering users with powerful <b>visualisations</b> and{" "}
            <b>analytics</b> for better, <b>informed choices</b> of tools and technologies. Whether
            you're considering what to learn, teach or just use, here, you will be able to find
            answers based on <b>data</b> coming straight <b>from job posts</b>, from what the{" "}
            <b>industry</b> requires.
          </Subtitle>
          <Buttons>
            <Button onClick={goToSearch}>
              Start your research <BsArrowRight />
            </Button>
            <Link href="/api-docs">
              <HiOutlineDocumentChartBar />
              <span>API documentation</span>
            </Link>
          </Buttons>
        </div>
        <Info>
          <b>Notice that currently</b> the dataset is limited mostly to programming/engineering and
          is intentionally kept relatively small. The data is based on the UK job market, mostly
          based on reed.co.uk
          <br />
          <i>In the future</i> funding would be necessary to maintain a larger dataset and support
          more tools and technologies from other industries.
        </Info>
      </Body>
      <Footer>
        developed with <BsHeartFill /> by{" "}
        <Link href="https://github.com/beeinger" target="_blank">
          <BsGithub />
          beeinger
        </Link>
      </Footer>
    </Container>
  );
}

const Buttons = styled.div`
  margin-top: 16px;

  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: center;
  justify-content: flex-start;

  > a {
    font-size: 1.1rem;
    text-decoration: none;
    color: #00c8f8;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }

    display: flex;
    align-items: center;
    gap: 8px;

    > span {
      margin-bottom: -0.2em;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    align-items: flex-start;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  height: 100vh;

  padding: 0px 64px;
  /* Phone screen */
  @media (max-width: 600px) {
    padding: 0px 16px;
  }

  position: relative;
  box-sizing: border-box;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  height: 100%;

  width: calc(100% - 128px);
  @media (max-width: 600px) {
    width: calc(100% - 32px);
  }
`;

const Info = styled.p`
  opacity: 0.8;

  > b {
    opacity: 1;
    color: #ff6666;
  }

  > i {
    opacity: 1;
    color: #00c8f8;
    font-style: normal;
  }

  /* Phone screen */
  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

const Button = styled.button`
  font-size: 1.5rem;
  font-weight: 600;

  max-width: 50%;
  padding: 16px 32px;
  border-radius: 8px;
  border: none;
  background-color: #00c8f8;
  color: #000;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  cursor: pointer;

  transition: background-color 0.2s ease-in-out;
  :hover {
    background-color: #4cd1ff;
  }
  :active {
    background-color: #00c8f8;
  }

  /* Phone screen */
  @media (max-width: 600px) {
    font-size: 1rem;
    max-width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 6rem;
  font-weight: 600;
  max-width: 90%;

  /* Phone screen */
  @media (max-width: 600px) {
    font-size: 3.5rem;
    margin-left: -8px;
  }

  > b {
    color: #00c8f8;
    font-weight: 900;
  }
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  font-weight: 400;

  max-width: 50%;

  /* Phone screen */
  @media (max-width: 600px) {
    font-size: 1rem;
    max-width: 90%;
  }

  > b {
    font-weight: 600;
    color: #00c8f8;
  }
`;

const Footer = styled.footer`
  width: calc(100% - 128px);
  @media (max-width: 600px) {
    width: calc(100% - 32px);
  }

  font-size: 1rem;

  /* Phone screen */
  @media (max-width: 600px) {
    font-size: 0.8rem;
  }

  margin-bottom: 16px;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  > a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #00c8f8;
  }

  svg {
    margin: 0 0.25rem;
    height: 1em;
    margin-top: -4px;
  }
`;
