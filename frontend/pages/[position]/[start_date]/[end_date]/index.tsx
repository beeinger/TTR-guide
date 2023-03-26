import axios from "axios";
import React from "react";
import { PositionStatistics } from "shared/types";
import { GetStaticPaths, InferGetStaticPropsType } from "next";
import TechStatistic from "components/TechStatistics";
import styled from "@emotion/styled";

export default function index({
  statistics,
  error,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (error) return <div>error</div>;
  console.log(statistics);
  return (
    <Layout>
      {statistics.tech_statistics.map((tech) => (
        <TechStatistic key={tech.tech} {...tech} />
      ))}
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  gap: 16px;
`;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          position: "all",
          start_date: "start",
          end_date: "end",
        },
      },
      {
        params: {
          position: "frontend",
          start_date: "start",
          end_date: "end",
        },
      },
    ],
    fallback: true, // can also be true or 'blocking'
  };
};

export async function getStaticProps(context) {
  const position = presets.position[context.params.position || "all"];
  const count_threshold = presets.count_threshold[context.params.position || "all"] || 0;

  const start_date = presets.start_date[context.params.start_date || "start"];
  const end_date = presets.end_date[context.params.end_date || "end"];

  const statistics = await axios
    .get<PositionStatistics>(
      "https://i8gd9ajvp7.execute-api.eu-west-2.amazonaws.com/dev/statistics",
      {
        params: { position, start_date, end_date, count_threshold },
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err.response);
      return { error: true, message: err.message };
    });

  return {
    props:
      (statistics as any).error === true
        ? { error: true }
        : { statistics: statistics as PositionStatistics },
    revalidate: 120,
  };
}

const presets = {
  position: { all: "", frontend: "frontend,front-end,front" },
  start_date: { start: "" },
  end_date: { end: "" },
  count_threshold: { all: 20 },
};
