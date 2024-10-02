import styled from "@emotion/styled";
import Link from "next/link";
import { BsGithub, BsHeartFill } from "react-icons/bs";

export default function IndexPage() {
  return (
    <Container>
      <Body>
        <Title>
          <b>T</b>ools and <b>T</b>echnologies <b>R</b>esearch <b>guide</b>
        </Title>
        <div>
          <Info>
            <i>🌅 Sunset info:</i> Sorry to everyone whose been using it, but{" "}
            <b>as of October 2024 this is now sunset.</b>
            <br />
            Anyone who wants to use this is free to set it up on their own, here is the{" "}
            <Link href="https://github.com/beeinger/TTR-guide" target="_blank">
              <BsGithub />
              open source GitHub repo.
            </Link>{" "}
            <br />
            I am sunsetting this due to high costs of DynamoDb on AWS, I'd love to make another
            iteration of this project in the future, but for now it's not feasible.
            <br />
            It definitely needs lots of changes, first of all getting rid of DynamoDb, architecture
            redesign and drastically improving the code quality.
            <br />
            <i>Thank you for understanding and sorry for the inconvenience!</i>
          </Info>
          <Subtitle>
            An all in one platform empowering users with powerful <b>visualisations</b> and{" "}
            <b>analytics</b> for better, <b>informed choices</b> of tools and technologies. Whether
            you're considering what to learn, teach or just use, here, you will be able to find
            answers based on <b>data</b> coming straight <b>from job posts</b>, from what the{" "}
            <b>industry</b> requires.
          </Subtitle>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  height: 100vh;

  padding: 0px 64px;
  /* Phone screen */
  @media (max-width: 700px) {
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

  @media (max-width: 700px) {
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
  @media (max-width: 700px) {
    font-size: 0.8rem;
  }

  > a {
    text-decoration: none;
    color: #00c8f8;
  }

  svg {
    margin: 0 0.25rem;
    height: 1em;
    margin-top: -4px;
  }
`;

const Title = styled.h1`
  font-size: 6rem;
  font-weight: 600;
  max-width: 90%;
  margin: 16px 0;

  @media (max-width: 1250px) {
    font-size: 3rem;
  }

  /* Phone screen */
  @media (max-width: 700px) {
    font-size: 3.5rem;
    margin-left: -8px;
  }

  > b {
    color: #00c8f8;
    font-weight: 900;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 400;

  max-width: 70%;

  @media (max-width: 1250px) {
    font-size: 1.5rem;
    max-width: 80%;
  }

  /* Phone screen */
  @media (max-width: 700px) {
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
  @media (max-width: 700px) {
    width: calc(100% - 32px);
  }

  font-size: 1rem;

  /* Phone screen */
  @media (max-width: 700px) {
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
