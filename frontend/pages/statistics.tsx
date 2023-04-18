import axios from "axios";
import React, { useEffect, useMemo } from "react";
import { StatisticsResponse } from "shared/types";
import { InferGetServerSidePropsType } from "next";
import TechStatistic from "components/TechStatistics";
import styled from "@emotion/styled";
import useSorting from "shared/hooks/useSorting";
import DateRange from "components/DateRange";
import Sorting from "components/Sorting";
import { useRouter } from "next/router";
import ScrollButton from "components/ScrollButton/ScrollButton";
import useScroll from "shared/hooks/useScroll";
import Head from "next/head";
import { shortTitle } from "./_document";

export default function index({
  error,
  position,
  generation_queued,
  statistics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { scroll, leftVisible, rightVisible, ref, updateVisibilityOfArrows } = useScroll();

  useEffect(() => {
    if (window.localStorage && statistics?.totalJobsCount)
      window.localStorage.setItem(position + "Count", statistics.totalJobsCount.toString());
  }, []);

  useEffect(() => {
    const refreshData = () => router.replace(router.asPath);
    let timeout: NodeJS.Timeout;
    if (generation_queued) timeout = setTimeout(refreshData, statistics ? 10_000 : 3_000);
    return () => clearTimeout(timeout);
  }, [generation_queued, router]);

  const maxValues = useMemo(
    () => ({
      popularity: Math.max(...(statistics?.techStatistics?.map((tech) => tech.popularity) || [])),
      location: Math.max(
        ...(statistics?.techStatistics
          ?.map((tech) => Object.values(tech.location_statistics))
          .flat() || [])
      ),
      type: Math.max(
        ...(statistics?.techStatistics?.map((tech) => Object.values(tech.type_statistics)).flat() ||
          [])
      ),
    }),
    [statistics]
  );

  const [techStatistics, setSorting] = useSorting(statistics?.techStatistics || []);

  if (error) return <div>error</div>;

  return (
    <>
      <Head>
        <title>{`Statistics for ${position.split(",").join(", ")} - ${shortTitle}`}</title>
      </Head>
      <Layout>
        {statistics && generation_queued ? (
          <RegeneratingInBg>
            getting newest data{" "}
            <Spinner style={{ transform: "scale(0.4)", opacity: 1, marginLeft: "-16px" }} />
          </RegeneratingInBg>
        ) : (
          false
        )}
        <Header>
          <DateRange />
          <Position>
            {position.split(",").join(", ")}
            <span>
              based on <b>{statistics?.totalJobsCount ?? "-"}</b> job posts
            </span>
          </Position>
          <Sorting setSorting={setSorting} />
        </Header>
        <div style={{ position: "relative", maxWidth: "100%" }}>
          <ScrollButton visible={leftVisible} type="left" onClick={scroll(-400)} />
          <Statistics ref={ref} onScroll={updateVisibilityOfArrows}>
            {techStatistics.length ? (
              techStatistics.map((tech) => (
                <TechStatistic key={tech.tech} tech={tech} maxValues={maxValues} />
              ))
            ) : (
              <NoData>
                {generation_queued ? (
                  <>
                    <Info>
                      It seems you are <i>the first</i> to request this data!
                    </Info>
                    <span>
                      Hang tight, this might take a wile, we are generating it <i>just for you</i>!
                      🫡
                    </span>
                    <Spinner />
                  </>
                ) : (
                  "Sorry, we have no data on this yet."
                )}
              </NoData>
            )}
          </Statistics>
          <ScrollButton visible={rightVisible} type="right" onClick={scroll(400)} />
        </div>
      </Layout>
    </>
  );
}

const RegeneratingInBg = styled.div`
  position: absolute;
  top: 8px;
  right: -8px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 0.8rem;
  font-family: "TrapSemBd";

  height: 32px;
`;

const Info = styled.span`
  font-size: 1.5rem;
  display: block;
  margin-bottom: 8px;
  font-family: "TrapSemBd";
`;

const Spinner = styled((props) => (
  <div {...props}>
    <div />
    <div />
    <div />
    <div />
  </div>
))`
  opacity: 0.5;

  & {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  & div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  & div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  & div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  & div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  & div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
`;

const NoData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  min-height: 30vh;

  i {
    font-style: italic;
    font-weight: 600;
    color: #00c8f8;
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  grid-template-rows: 1fr;
  grid-template-areas: "date position sorting";

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    //! Until date component is not ready it's not taking space
    grid-template-rows: 1fr 0.5fr 0fr;
    grid-template-areas:
      "position"
      "sorting"
      "date";
  }

  width: 100%;
  box-sizing: border-box;
  padding: 0 5vw;
  justify-self: flex-start;
`;

const Position = styled.h1`
  grid-area: position;

  font-size: 4rem;
  font-family: "TrapBlack";
  text-transform: uppercase;
  margin: 0;
  margin-top: 5vh;
  margin-bottom: 5vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > span {
    text-transform: none;
    font-size: 1rem;
    font-family: "TrapLight";
    opacity: 0.5;

    > b {
      font-family: "Trap";
    }
  }
`;

const Layout = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  justify-content: center;
  min-height: calc(100vh - 16px);
`;

const Statistics = styled.div`
  display: flex;
  align-self: flex-start;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;

  /* For WebKit (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 0;
    background: transparent; /* Optional: just make scrollbar invisible */
  }

  /* For Firefox */
  html {
    scrollbar-width: none; /* Firefox 64+ */
  }

  /* For Internet Explorer and Edge */
  body {
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }
`;

export async function getServerSideProps({ res, query }) {
  const preset_position = query?.position || "all";
  const positions = presets.position[preset_position] ?? preset_position;
  const count_threshold = 25;

  const start_date = presets.start_date[query?.start_date || "start"] || query?.start_date;
  const end_date = presets.end_date[query?.end_date || "end"] || query?.end_date;

  const statistics = await axios
    .get<StatisticsResponse>("https://api.ttr.guide/statistics", {
      params: { positions, start_date, end_date, count_threshold },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err.response);
      return { error: true, message: err.message };
    });

  if ((statistics as StatisticsResponse)?.generation_queued === false)
    res.setHeader("Cache-Control", `public, s-maxage=${60 * 60 * 6}, stale-while-revalidate`);

  return {
    props: {
      ...(statistics as StatisticsResponse),
      position: preset_position,
      error: false,
    },
  };
}

const presets = {
  position: {
    all: "",
    frontend: "frontend,front-end,front,css,react,vue,angular,html",
    backend: "backend,back-end,back,php,node,express,rust,sql",
    fullstack: "fullstack,full-stack,full,full-stack",
  },
  start_date: { start: "" },
  end_date: { end: "" },
};
