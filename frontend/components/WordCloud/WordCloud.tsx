import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useMemo } from "react";
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

  const wordCount = useMemo(
    () =>
      words.map((word) => ({
        ...word,
        value: Number(window.localStorage.getItem(word.text + "Count")) || word.value,
      })),
    []
  );

  const callbacks = {
    onWordClick: (word) => router.push(word.link),
    getWordTooltip: (word) => `based on ${word.value} jobs`,
  };

  return (
    <Container>
      <ReactWordcloud
        words={wordCount}
        options={{
          rotationAngles: [0, 0],
          rotations: 0,
          fontWeight: "700",
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
      <span>Size of the word represent how many job posts of this technology are available.</span>
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

  > span {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
  }
`;
