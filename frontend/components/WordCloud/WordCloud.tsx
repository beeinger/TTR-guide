import styled from "@emotion/styled";
import { useRouter } from "next/router";
import ReactWordcloud from "react-wordcloud";

const words = [
  {
    text: "all",
    value: 45_000,
    link: "/statistics",
  },
  {
    text: "frontend",
    value: 12_000,
    link: "/statistics?position=frontend",
  },
  {
    text: "backend",
    value: 20_000,
    link: "/statistics?position=backend",
  },
  {
    text: "fullstack",
    value: 10_000,
    link: "/statistics?position=fullstack",
  },
];

export default function WordCloud() {
  const router = useRouter();
  const callbacks = {
    onWordClick: (word) => router.push(word.link),
    getWordTooltip: (word) => `${word.text} - ${word.value} indexed job posts`,
  };

  return (
    <Container>
      <ReactWordcloud
        words={words}
        options={{
          rotationAngles: [0, 0],
          rotations: 0,
          fontFamily: "TrapBlack",
          fontSizes: [20, 100],
          padding: 8,
          deterministic: true,
          colors: [
            "#D0F0FF",
            "#C2E8FF",
            "#B4E0FF",
            "#A6D8FF",
            "#98D0FF",
            "#8AC8FF",
            "#7CC0FF",
            "#6EB8FF",
            "#60B0FF",
            "#52A8FF",
          ],
        }}
        callbacks={callbacks}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;

  margin-top: 10vh;
  margin-bottom: 5vh;
`;
