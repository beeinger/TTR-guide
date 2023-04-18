import React from "react";

import dynamic from "next/dynamic";
import styled from "@emotion/styled";
import { BsArrowRight } from "react-icons/bs";
import { useRouter } from "next/router";
import Head from "next/head";
import { shortTitle } from "./_document";

const WordCloud = dynamic(() => import("components/WordCloud"), { ssr: false });

export default function search() {
  const [keywords, setKeywords] = React.useState<string>("");
  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => setKeywords(e.target.value);

  const router = useRouter();
  const handleSearch = () => {
    const query = keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .join(",");
    router.push(`/statistics` + (query ? `?position=${query}` : ""));
  };

  return (
    <>
      <Head>
        <title>{`Search statistics - ${shortTitle}`}</title>
      </Head>
      <Container>
        <h1>What are you looking for?</h1>
        <WordCloud />
        <h2>Looking for something else?</h2>
        <span>
          Try searching for keywords separated by comas
          <br />
          eg. <b>frontend,backend,fullstack</b>
          <br />
          or <b>react,excel,sql</b>
        </span>
        <InputContainer>
          <KeywordInput
            value={keywords}
            onChange={handleType}
            placeholder="Keywords of tools and technologies"
          />
          <button onClick={handleSearch}>
            <BsArrowRight />
          </button>
        </InputContainer>
      </Container>
    </>
  );
}

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 32px;
  width: 100%;
  max-width: 400px;

  /* Phone screen */
  @media (max-width: 600px) {
    max-width: 90%;
  }

  > button {
    margin-left: -1px;
    height: 2rem;
    border-radius: 0px 8px 8px 0px;
    border: 2px solid #00c8f8;
    border-left: none;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #00c8f8;
    color: #000;

    cursor: pointer;

    transition: background-color 0.2s ease-in-out;

    :hover {
      background-color: #4cd1ff;
    }
    :active {
      background-color: #00c8f8;
    }

    > svg {
      margin: 0px 8px;
      height: 1.5rem;
      width: 1.5rem;
    }
  }
`;

const KeywordInput = styled.input`
  font-size: 1rem;
  font-weight: 600;
  padding: 8px;
  border-radius: 8px 0px 0px 8px;
  border: 2px solid #00c8f8;
  border-right: none;
  background-color: transparent;
  width: 100%;
  color: white;
  height: 2rem;
  box-sizing: border-box;

  :placeholder {
    opacity: 0.5;
  }

  :focus {
    outline: none;
  }

  @media (max-width: 1100px) {
    max-width: 90%;
    font-size: 0.8rem;
  }
`;

const Container = styled.div`
  margin: 64px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px - 64px);
  width: 100vw;
  box-sizing: border-box;

  b {
    color: #00c8f8;
  }

  > h1 {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 0px;

    @media (max-width: 1100px) {
      font-size: 2rem;
    }

    @media (max-width: 700px) {
      font-size: 1.8rem;
    }
  }

  > h2 {
    @media (max-width: 1100px) {
      font-size: 1.2rem;
    }

    @media (max-width: 700px) {
      font-size: 1.1rem;
    }
  }

  > span {
    @media (max-width: 1100px) {
      font-size: 0.8rem;
    }

    @media (max-width: 700px) {
      font-size: 0.7rem;
    }
  }

  text-align: center;
`;
