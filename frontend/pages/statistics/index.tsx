import axios from "axios";
import React, { useCallback, useEffect, useMemo } from "react";
import { StatisticsResponse } from "shared/types";
import { InferGetServerSidePropsType } from "next";
import TechStatistic from "components/TechStatistics";
import styled from "@emotion/styled";
import useSorting from "shared/hooks/useSorting";
import DateRange from "components/DateRange";
import Sorting from "components/Sorting";
import { useRouter } from "next/router";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function index({
  error,
  position,
  generation_queued,
  statistics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const refreshData = useCallback(() => router.replace(router.asPath), [router]);

  useEffect(() => {
    if (generation_queued) {
      setTimeout(refreshData, 1000);
    }
  }, [generation_queued, refreshData]);

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
    <Layout>
      <Header>
        <DateRange />
        <Position>{position}</Position>
        <Sorting />
      </Header>
      <Statistics>
        {techStatistics.map((tech) => (
          <TechStatistic key={tech.tech} tech={tech} maxValues={maxValues} />
        ))}
      </Statistics>
    </Layout>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 0 5vw;
`;

const Position = styled.h1`
  font-size: 4rem;
  font-family: "TrapBlack";
  text-transform: uppercase;
  margin: 0;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  justify-content: space-evenly;
  min-height: 100vh;
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
  const positions = presets.position[preset_position] || preset_position;
  const count_threshold = 25;

  const start_date = presets.start_date[query?.start_date || "start"] || query?.start_date;
  const end_date = presets.end_date[query?.end_date || "end"] || query?.end_date;

  const statistics = await axios
    .get<StatisticsResponse>(
      "https://i8gd9ajvp7.execute-api.eu-west-2.amazonaws.com/dev/statistics",
      {
        params: { positions, start_date, end_date, count_threshold },
      }
    )
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
  position: { all: "", frontend: "frontend,front-end,front,css" },
  start_date: { start: "" },
  end_date: { end: "" },
};
