import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsArrowRight, BsGithub, BsHeartFill } from "react-icons/bs";

export default function IndexPage() {
  const router = useRouter();
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
          <Button onClick={() => router.push("/search")}>
            Start your research <BsArrowRight />
          </Button>
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
    color: #ff0000;
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
  font-family: "Trap";

  margin-top: 16px;
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

  max-width: 90%;

  /* Phone screen */
  @media (max-width: 600px) {
    font-size: 3.5rem;
    margin-left: -8px;
  }

  > b {
    font-family: "Trap";
    color: #00c8f8;
  }
`;

const Subtitle = styled.h2`
  font-size: 2rem;

  max-width: 50%;

  /* Phone screen */
  @media (max-width: 600px) {
    font-size: 1rem;
    max-width: 90%;
  }

  font-family: "TrapLight";

  > b {
    font-family: "Trap";
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
