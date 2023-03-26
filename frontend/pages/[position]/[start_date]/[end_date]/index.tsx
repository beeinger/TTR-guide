import axios from "axios";
import React, { useMemo } from "react";
import { PositionStatistics } from "shared/types";
import { GetStaticPaths, InferGetStaticPropsType } from "next";
import TechStatistic from "components/TechStatistics";
import styled from "@emotion/styled";
import useSorting from "shared/hooks/useSorting";
import DateRange from "components/DateRange";
import Sorting from "components/Sorting";

export default function index({
  statistics,
  position,
  error,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const maxValues = useMemo(
    () => ({
      popularity: Math.max(...(statistics?.tech_statistics?.map((tech) => tech.popularity) || [])),
      location: Math.max(
        ...(statistics?.tech_statistics
          ?.map((tech) => Object.values(tech.location_statistics))
          .flat() || [])
      ),
      type: Math.max(
        ...(statistics?.tech_statistics
          ?.map((tech) => Object.values(tech.type_statistics))
          .flat() || [])
      ),
    }),
    [statistics]
  );

  const [techStatistics, setSorting] = useSorting(statistics?.tech_statistics || []);

  if (error) return <div>error</div>;
  console.log(statistics);

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
  const preset_position = context.params.position || "all";
  const position = presets.position[preset_position] || preset_position;
  const count_threshold = presets.count_threshold[preset_position] || 0;

  const start_date = presets.start_date[context.params.start_date || "start"];
  const end_date = presets.end_date[context.params.end_date || "end"];

  // const statistics = await axios
  //   .get<PositionStatistics>(
  //     "https://i8gd9ajvp7.execute-api.eu-west-2.amazonaws.com/dev/statistics",
  //     {
  //       params: { position, start_date, end_date, count_threshold },
  //     }
  //   )
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     console.log(err.response);
  //     return { error: true, message: err.message };
  //   });

  const statistics = {
    end_date: null,
    positions: [""],
    start_date: null,
    tech_statistics: [
      {
        count: 942,
        location_statistics: {
          hybrid: 465,
          office: 222,
          remote: 255,
        },
        popularity: 0.055644161999225616,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            0, 21500, 23000, 25000, 30000, 30000, 30000, 30000, 32500, 32500, 35000, 35000, 35000,
            36500, 37500, 38000, 38500, 40000, 40000, 40000, 40000, 41000, 42500, 42500, 42500,
            42500, 42500, 44000, 45000, 45000, 45000, 45000, 45000, 45000, 45000, 45000, 45000,
            47000, 47500, 47500, 47500, 47500, 47500, 47500, 48500, 48500, 49574.40625, 50000,
            50000, 50000, 50000, 50000, 50000, 50000, 50000, 52000, 52144.9765625, 52144.9765625,
            52144.9765625, 52492.80078125, 52500, 52500, 52500, 52500, 52500, 55000, 55000, 55000,
            55000, 57000, 57000, 57000, 57500, 57500, 57500, 57500, 57500, 58000, 60000, 60000,
            60000, 60000, 60000, 60000, 60000, 60000, 62500, 62500, 65000, 65000, 65000, 65000,
            65000, 65000, 65000, 65000, 65000.5, 70000, 70000, 70000, 70000, 70000, 70356,
            71199.2109375, 72000, 72500, 72500, 72500, 72500, 72845.4296875, 73550.3984375,
            74230.796875, 75000, 75000, 75000, 75000, 75000, 75000, 77500, 77500, 77500, 80000,
            80000, 80000, 82500, 82500, 82500, 85000, 85000, 85000, 85000, 85000, 85000, 87500,
            87500, 87500, 90000, 90000, 91000, 92500, 92500, 92500, 92500, 100000, 105000, 108000,
            110000, 110000, 117000, 117000, 118300, 120000, 120000, 130000, 133250, 146250, 156000,
            175809.40625, 182000,
          ],
          lower_quartile: 47500,
          max: 182000,
          median: 60000,
          min: 0,
          upper_quartile: 77500,
        },
        tech: "javascript",
        type_statistics: {
          freelance: 61,
          full_time: 941,
          part_time: 14,
        },
      },
      {
        count: 669,
        location_statistics: {
          hybrid: 300,
          office: 161,
          remote: 208,
        },
        popularity: 0.03951798751950264,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            27000, 35000, 40000, 40000, 40000, 40000, 42500, 42500, 44000, 45000, 45000, 45000,
            45000, 47500, 47500, 47500, 47500, 47500, 48042.71875, 50000, 50000, 50000, 50000,
            50000, 50000, 50000, 50000, 52392, 52500, 52500, 55000, 55000, 55000, 55000, 55000,
            55000, 55000, 55000, 57500, 57500, 57500, 60000, 60000, 60000, 60000, 60000, 62500,
            62500, 65000, 65000, 65000, 65000, 65000, 65000, 65000, 65000, 65000, 65000, 65000,
            65000, 65000, 67500, 67500, 67500, 67500, 67500, 70000, 70000, 70000, 70000, 70000,
            71787.4609375, 72500, 72500, 72500, 75000, 75000, 75000, 75000, 75000, 75000, 75000,
            75000, 75000, 75000, 75000, 75000, 77500, 77500, 77500, 77500, 77500, 77500, 80000,
            80000, 80000, 80000, 82500, 82500, 82500, 82500, 82500, 82500, 82500, 85000, 85000,
            85000, 85000, 85000, 85000, 87500, 87500, 87750, 90000, 90000, 92500, 92500, 92500,
            95000, 95000, 95000, 95000, 97500, 100000, 100000, 100000, 100000, 100000, 100000,
            102500, 105000, 105000, 105000, 105000, 105000, 110000, 110000, 110500, 112500, 112500,
            112500, 112500, 112500, 112500, 117000, 117000, 123500, 123500, 123500, 123500, 123500,
            125000, 130000, 130000, 133250, 136500, 136500, 140400, 143000, 156000, 182000,
          ],
          lower_quartile: 57500,
          max: 182000,
          median: 75000,
          min: 27000,
          upper_quartile: 95000,
        },
        tech: "react",
        type_statistics: {
          freelance: 51,
          full_time: 669,
          part_time: 2,
        },
      },
      {
        count: 471,
        location_statistics: {
          hybrid: 194,
          office: 132,
          remote: 145,
        },
        popularity: 0.027822080999612808,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            30000, 39500, 40000, 40000, 42500, 50000, 52500, 55000, 55000, 55000, 57500, 57500,
            57500, 60000, 60000, 60000, 60000, 65000, 67500, 67500, 67500, 67500, 67500, 71000,
            77500, 77500, 77500, 80000, 80000, 80000, 80000, 82500, 82500, 85000, 90000, 90000,
            92500, 95000, 97500, 97500, 97500, 97500, 100000, 105000, 105000, 110000, 112500,
            115000, 122070, 136500, 162500,
          ],
          lower_quartile: 57500,
          max: 162500,
          median: 77500,
          min: 30000,
          upper_quartile: 97500,
        },
        tech: "typescript",
        type_statistics: {
          freelance: 35,
          full_time: 471,
          part_time: 10,
        },
      },
      {
        count: 459,
        location_statistics: {
          hybrid: 224,
          office: 120,
          remote: 115,
        },
        popularity: 0.027113238349556923,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            32500, 39766.5, 40000, 42500, 42500, 43249, 45000, 45000, 45000, 47500, 47500, 47500,
            47500, 47500, 50000, 50000, 50000, 50000, 50000, 50000, 52500, 52500, 52954.796875,
            55000, 55000, 55000, 55000, 55000, 55000, 55000, 55000.5, 56500, 57500, 57500, 60000,
            60000, 62500, 62500, 63306, 65000, 65000, 65000, 65000, 65000, 65000, 68737.5, 70000,
            70000, 70000, 70000, 72500, 75000, 75000, 75000, 75000, 75500, 80000, 85000, 85000,
            90000, 115000, 125000, 125000, 125000, 136500, 140000, 152750, 153400, 153400, 195000,
          ],
          lower_quartile: 50000,
          max: 195000,
          median: 60000,
          min: 32500,
          upper_quartile: 75000,
        },
        tech: "angular",
        type_statistics: {
          freelance: 25,
          full_time: 459,
          part_time: 3,
        },
      },
      {
        count: 443,
        location_statistics: {
          hybrid: 226,
          office: 120,
          remote: 97,
        },
        popularity: 0.026168113574385643,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            27500, 27500, 27500, 30000, 30000, 30000, 30000, 30000, 30656.5, 35000, 37500, 38500,
            40000, 40000, 40000, 40000, 45000, 46000, 47500, 50000, 50000, 50000, 52500, 52500,
            52500, 52500, 55000, 55000, 55000, 55000, 55000, 55000, 55000, 55378.8984375,
            55378.8984375, 57500, 57500, 60000, 61625.87890625, 62500, 66726, 67500, 70230.40625,
            77500, 77500, 77500, 77500, 77500, 80000, 82500, 82500, 90000, 91000, 92500, 133900,
            136500, 178100, 178100, 178100,
          ],
          lower_quartile: 40000,
          max: 178100,
          median: 55000,
          min: 27500,
          upper_quartile: 77500,
        },
        tech: "sql",
        type_statistics: {
          freelance: 36,
          full_time: 442,
          part_time: 5,
        },
      },
      {
        count: 406,
        location_statistics: {
          hybrid: 233,
          office: 77,
          remote: 96,
        },
        popularity: 0.023982515558600426,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            31500, 35000, 35000, 38048.5, 40000, 40000, 40000, 42000, 42000, 42500, 43750, 43750,
            47111.21875, 50000, 52500, 52500, 55000, 55000, 55000, 55000, 55000, 55000, 56000,
            57500, 57500, 57500, 57500, 57500, 57500, 57500, 57500, 57500, 58500, 60000, 60000,
            60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
            60000, 60000, 60000, 60000, 62500, 62500, 62500, 62500, 64500, 65000, 66000, 67500,
            67500, 67500, 67500, 68000, 70000, 70000, 70000, 70000, 70000, 70000, 71000, 72500,
            72500, 72500, 72500, 75000, 75000, 75000, 75000, 75000, 77500, 77500, 77500, 80000,
            80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000.5,
            82500, 82500, 85000, 85000, 87500, 87500, 87500, 90000, 90000, 90000, 92500, 92500,
            92500, 95000, 95000, 97500, 98944.703125, 100000, 105000, 105000, 107500, 107500,
            107500, 110500, 110500, 117000, 117930.078125, 122500, 122500, 123500, 130000, 130000,
            135000, 149500, 158600, 169000, 182000, 188500, 507500,
          ],
          lower_quartile: 60000,
          max: 507500,
          median: 70000,
          min: 31500,
          upper_quartile: 87500,
        },
        tech: "python",
        type_statistics: {
          freelance: 28,
          full_time: 406,
          part_time: 4,
        },
      },
      {
        count: 355,
        location_statistics: {
          hybrid: 165,
          office: 99,
          remote: 91,
        },
        popularity: 0.02096993289887905,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            44665.5, 50000, 57500, 57500, 57500, 57500, 66000, 66000, 66000, 66000, 67500, 72500,
            80000,
          ],
          lower_quartile: 57500,
          max: 80000,
          median: 66000,
          min: 44665,
          upper_quartile: 66750,
        },
        tech: "sql server",
        type_statistics: {
          freelance: 8,
          full_time: 355,
          part_time: 1,
        },
      },
      {
        count: 337,
        location_statistics: {
          hybrid: 154,
          office: 100,
          remote: 83,
        },
        popularity: 0.019906669855117798,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            575, 20024.490234375, 26000, 26000, 29081.25, 32500, 35000, 37500, 38584.3515625, 39000,
            40000, 40500, 41000, 42500, 42500, 43000, 45000, 47500, 47500, 48534.75, 50000, 50000,
            50000, 50000, 50000, 50000, 50000, 52500, 52500, 53000, 53000, 53000, 55000, 55000,
            55000, 55000, 55000, 55000, 55000, 55000, 55000, 57000, 57500, 58000, 59565.375, 60000,
            60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 62500, 62500, 62500, 62500,
            62500, 65000, 65000, 65000, 65000, 65000, 65000, 67000, 67500, 67500, 67500, 67500,
            67500, 67500, 67685.3203125, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
            70000, 70000, 70000, 70000, 70000, 70000, 70000, 72500, 74000, 75000, 75000, 75000,
            75000, 75000, 75000, 75000, 75000, 75008.25, 77500, 77500, 80000, 80000, 80000, 80000,
            80000, 80000, 82500, 82500, 82500, 82500, 82500, 84500, 84500, 85000, 85000, 85000,
            85000, 85000, 85000, 85000, 85000, 85000, 87500, 87500, 87500, 87500, 87500, 87750,
            87750, 90000, 90000, 90000, 92500, 92500, 92500, 92500, 92500, 94000, 94250, 97500,
            100000, 100000, 100000, 100000, 100000, 100000, 102500, 102500, 105000, 105000, 105000,
            107250, 110000, 110000, 110000, 110000, 110500, 111000, 111000, 112500, 112500, 113750,
            114500, 115000, 115000, 117000, 117000, 117500, 120250, 123500, 125000, 125761.3515625,
            130000, 143000, 149500, 149500, 149500, 149500, 156000, 156130, 159250, 159250, 159250,
            159250, 159250, 159250, 162500, 162500, 162500, 182000, 182000, 182000, 195000,
          ],
          lower_quartile: 60000,
          max: 195000,
          median: 75000,
          min: 575,
          upper_quartile: 100000,
        },
        tech: "java",
        type_statistics: {
          freelance: 36,
          full_time: 337,
          part_time: 0,
        },
      },
      {
        count: 328,
        location_statistics: {
          hybrid: 158,
          office: 83,
          remote: 87,
        },
        popularity: 0.019375037401914597,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            32500, 33500, 37500, 37500, 37500, 39000, 40000, 40000, 42000, 45000, 45000, 45500,
            50000, 54000, 67500, 70000, 72500, 75000, 162500,
          ],
          lower_quartile: 37500,
          max: 162500,
          median: 45000,
          min: 32500,
          upper_quartile: 67500,
        },
        tech: "css",
        type_statistics: {
          freelance: 30,
          full_time: 328,
          part_time: 4,
        },
      },
      {
        count: 291,
        location_statistics: {
          hybrid: 152,
          office: 69,
          remote: 70,
        },
        popularity: 0.01718943752348423,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            35000, 40000, 42500, 42500, 43500, 45000, 47500, 47500, 47500, 50000, 50000, 50000,
            50000, 50000, 50000, 52500, 52500, 52500, 52500, 55000, 55000, 55000, 55000, 55000,
            55000, 55000, 55000, 55117.4375, 57500, 57500, 57500, 58000, 60000, 60000, 60000, 60000,
            60000, 60000, 60000, 60000, 60000, 62500, 65000, 65000, 65000, 65000, 67500, 70000,
            70000, 70000, 70000, 75000, 75000, 77500.5, 80000, 80000, 90000, 90000, 95000, 105000,
            120000, 123500, 135000, 160000, 182000,
          ],
          lower_quartile: 52500,
          max: 182000,
          median: 60000,
          min: 35000,
          upper_quartile: 70000,
        },
        tech: "azur",
        type_statistics: {
          freelance: 15,
          full_time: 290,
          part_time: 1,
        },
      },
      {
        count: 279,
        location_statistics: {
          hybrid: 137,
          office: 67,
          remote: 75,
        },
        popularity: 0.016480594873428345,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            45000, 45000, 50000, 50000, 50000, 50000, 55000, 55000, 55000, 55959.75, 57500, 57500,
            57500, 57500, 57500, 58000, 58000, 58000, 60000, 60000, 60000, 61387.921875, 62500,
            62500, 62500, 62500, 62500, 62500, 62500, 65000, 68240.640625, 75000, 75000, 77500,
            77500, 77500, 80000, 80000, 85000, 87500, 95000, 95000, 320000, 320000, 320000, 320000,
            320000, 320000, 320000,
          ],
          lower_quartile: 57500,
          max: 320000,
          median: 62500,
          min: 45000,
          upper_quartile: 80000,
        },
        tech: "azure",
        type_statistics: {
          freelance: 6,
          full_time: 279,
          part_time: 2,
        },
      },
      {
        count: 245,
        location_statistics: {
          hybrid: 122,
          office: 63,
          remote: 60,
        },
        popularity: 0.014472207054495811,
        popularity_statistics: [],
        salary_statistics: {
          all: [98175],
          lower_quartile: 0,
          max: 98175,
          median: 98175,
          min: 98175,
          upper_quartile: 0,
        },
        tech: "docker",
        type_statistics: {
          freelance: 18,
          full_time: 245,
          part_time: 0,
        },
      },
      {
        count: 239,
        location_statistics: {
          hybrid: 138,
          office: 60,
          remote: 41,
        },
        popularity: 0.014117785729467869,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000,
            28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000,
            28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000,
            28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000,
            28000, 28000, 28000, 28000, 32500, 35000.5, 45000, 52500, 55000, 87500, 89000,
          ],
          lower_quartile: 28000,
          max: 89000,
          median: 28000,
          min: 28000,
          upper_quartile: 28000,
        },
        tech: "html5",
        type_statistics: {
          freelance: 5,
          full_time: 239,
          part_time: 5,
        },
      },
      {
        count: 233,
        location_statistics: {
          hybrid: 126,
          office: 48,
          remote: 59,
        },
        popularity: 0.013763364404439926,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            33500, 35000, 37500, 37500, 37500, 37500, 38000, 40000, 40000, 40000, 41500, 42500,
            42500, 42500, 42500, 42500, 42500, 42500, 42500, 42500, 42500, 42500, 45000, 45000,
            45000, 45000, 45000, 45000, 45000, 45000, 45000, 45000, 47500, 47500, 47500, 47500,
            47500, 47500.5, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000,
            50000, 50000, 50000, 50000, 52500, 52500, 52500, 52500, 52500, 52500, 52500, 52500,
            52500, 52500, 52500, 55000, 55000, 55000, 55000, 55000, 55000, 55000, 55000, 55000,
            55000, 55000, 55000, 55000, 55000, 57500, 57500, 57500, 57500, 58500, 60000, 60000,
            60000, 60147.6640625, 62500, 63428.796875, 65000, 65000, 65000, 67500, 67500, 67500,
            67500, 67500, 67500, 67500, 70000, 70000, 70000, 70000, 70000, 71500, 72500, 72500,
            72500, 75000, 75000, 75000, 75000, 75000, 80000, 80000, 80000, 82500, 82500, 82500,
            82500, 90000, 90000, 90000, 95000, 100000, 102500, 110000, 150000,
          ],
          lower_quartile: 45000,
          max: 150000,
          median: 55000,
          min: 33500,
          upper_quartile: 67500,
        },
        tech: "asp",
        type_statistics: {
          freelance: 3,
          full_time: 232,
          part_time: 1,
        },
      },
      {
        count: 233,
        location_statistics: {
          hybrid: 98,
          office: 71,
          remote: 64,
        },
        popularity: 0.013763364404439926,
        popularity_statistics: [],
        salary_statistics: {
          all: [40000, 40000, 41500, 94900, 117000],
          lower_quartile: 40000,
          max: 117000,
          median: 41500,
          min: 40000,
          upper_quartile: 105950,
        },
        tech: "git",
        type_statistics: {
          freelance: 19,
          full_time: 233,
          part_time: 3,
        },
      },
      {
        count: 232,
        location_statistics: {
          hybrid: 114,
          office: 54,
          remote: 64,
        },
        popularity: 0.013704294338822365,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            30000, 37500, 40000, 40000, 42500, 43000, 45000, 50000, 55000, 55000, 55000, 65000,
            70000, 70000, 70000, 90000, 102500, 120900, 120900, 120900, 120900, 149500,
          ],
          lower_quartile: 43000,
          max: 149500,
          median: 60000,
          min: 30000,
          upper_quartile: 102500,
        },
        tech: "api",
        type_statistics: {
          freelance: 15,
          full_time: 232,
          part_time: 0,
        },
      },
      {
        count: 210,
        location_statistics: {
          hybrid: 96,
          office: 58,
          remote: 56,
        },
        popularity: 0.012404749169945717,
        popularity_statistics: [],
        salary_statistics: {
          all: [56885.3984375],
          lower_quartile: 0,
          max: 56885,
          median: 56885,
          min: 56885,
          upper_quartile: 0,
        },
        tech: "rest api",
        type_statistics: {
          freelance: 19,
          full_time: 210,
          part_time: 3,
        },
      },
      {
        count: 186,
        location_statistics: {
          hybrid: 92,
          office: 35,
          remote: 59,
        },
        popularity: 0.010987063869833946,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            0, 325, 18000, 21500, 26500, 26500, 27500, 28000, 29000, 29500, 30000, 30000, 31118.5,
            32500, 33500, 33500, 33500, 35000, 35000, 35000, 35000, 35000, 35000, 35000, 35000,
            35000, 37500, 37500, 37500, 40000, 40000, 42500, 42500, 43263, 43500, 43500, 45000,
            45000, 45000, 45000, 45000, 45000, 45000, 45000, 47500, 47500, 47500, 47500, 50000,
            50000, 50000, 50000, 50000, 50000, 50000, 51000, 52500, 52500, 52500, 52500, 52500,
            52500, 55000, 55000, 55000, 55000, 55000, 55000, 55000, 55000, 55000, 57500, 57500,
            57500, 57500, 57500, 60000, 60000, 60000, 60000, 62500, 62500, 62500, 62500, 62500,
            65000, 65000, 65000, 65000, 65000, 65000, 65000, 67500, 70000, 70000, 70000, 70000,
            72500, 75000, 75000, 78000, 80000, 80000, 80000, 80000, 83718.75, 84500, 85000, 90000,
            90000, 91000, 95000, 105000, 123500,
          ],
          lower_quartile: 37500,
          max: 123500,
          median: 52500,
          min: 0,
          upper_quartile: 65000,
        },
        tech: "php",
        type_statistics: {
          freelance: 10,
          full_time: 186,
          part_time: 0,
        },
      },
      {
        count: 167,
        location_statistics: {
          hybrid: 96,
          office: 34,
          remote: 37,
        },
        popularity: 0.009864728897809982,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            32500, 36500, 41000, 41250, 47500, 55000, 55000, 55000, 55000, 57500, 60000, 500000,
          ],
          lower_quartile: 41125,
          max: 500000,
          median: 55000,
          min: 32500,
          upper_quartile: 56250,
        },
        tech: "mvc",
        type_statistics: {
          freelance: 2,
          full_time: 167,
          part_time: 0,
        },
      },
      {
        count: 159,
        location_statistics: {
          hybrid: 108,
          office: 30,
          remote: 21,
        },
        popularity: 0.009392167441546917,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "css3",
        type_statistics: {
          freelance: 1,
          full_time: 159,
          part_time: 3,
        },
      },
      {
        count: 155,
        location_statistics: {
          hybrid: 71,
          office: 23,
          remote: 61,
        },
        popularity: 0.009155886247754097,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            44000, 45000, 50000, 55020.625, 60000, 62500, 62500, 62500, 70000, 77500, 80000, 80000,
            80000, 85000, 90000, 110000, 110000, 110000, 136500,
          ],
          lower_quartile: 60000,
          max: 136500,
          median: 77500,
          min: 44000,
          upper_quartile: 90000,
        },
        tech: "node js",
        type_statistics: {
          freelance: 17,
          full_time: 155,
          part_time: 4,
        },
      },
      {
        count: 152,
        location_statistics: {
          hybrid: 72,
          office: 48,
          remote: 32,
        },
        popularity: 0.008978676050901413,
        popularity_statistics: [],
        salary_statistics: {
          all: [46500, 59255.640625],
          lower_quartile: 46500,
          max: 59255,
          median: 52877,
          min: 46500,
          upper_quartile: 59255,
        },
        tech: "microservices",
        type_statistics: {
          freelance: 14,
          full_time: 152,
          part_time: 0,
        },
      },
      {
        count: 142,
        location_statistics: {
          hybrid: 81,
          office: 23,
          remote: 38,
        },
        popularity: 0.00838797353208065,
        popularity_statistics: [],
        salary_statistics: {
          all: [40000, 44000, 55000, 57500, 57500, 57500, 72500],
          lower_quartile: 44000,
          max: 72500,
          median: 57500,
          min: 40000,
          upper_quartile: 57500,
        },
        tech: "vue js",
        type_statistics: {
          freelance: 1,
          full_time: 142,
          part_time: 0,
        },
      },
      {
        count: 141,
        location_statistics: {
          hybrid: 67,
          office: 31,
          remote: 43,
        },
        popularity: 0.008328903466463089,
        popularity_statistics: [],
        salary_statistics: {
          all: [62500],
          lower_quartile: 0,
          max: 62500,
          median: 62500,
          min: 62500,
          upper_quartile: 0,
        },
        tech: "mysql",
        type_statistics: {
          freelance: 7,
          full_time: 141,
          part_time: 1,
        },
      },
      {
        count: 127,
        location_statistics: {
          hybrid: 54,
          office: 42,
          remote: 31,
        },
        popularity: 0.007501919753849506,
        popularity_statistics: [],
        salary_statistics: {
          all: [85000],
          lower_quartile: 0,
          max: 85000,
          median: 85000,
          min: 85000,
          upper_quartile: 0,
        },
        tech: "aws",
        type_statistics: {
          freelance: 10,
          full_time: 127,
          part_time: 1,
        },
      },
      {
        count: 125,
        location_statistics: {
          hybrid: 74,
          office: 32,
          remote: 19,
        },
        popularity: 0.007383779156953096,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            39500, 40000, 40000, 40000, 40000, 45000, 45000, 47500, 60000, 62500, 67500, 67500,
            70000, 70000, 70000, 70000, 72500, 75000, 77500, 77500, 80000, 80000, 87500, 87500,
            90000, 140000, 156000, 169000, 405000,
          ],
          lower_quartile: 46250,
          max: 405000,
          median: 70000,
          min: 39500,
          upper_quartile: 83750,
        },
        tech: "cloud",
        type_statistics: {
          freelance: 3,
          full_time: 125,
          part_time: 2,
        },
      },
      {
        count: 123,
        location_statistics: {
          hybrid: 69,
          office: 22,
          remote: 32,
        },
        popularity: 0.007265639025717974,
        popularity_statistics: [],
        salary_statistics: {
          all: [58000],
          lower_quartile: 0,
          max: 58000,
          median: 58000,
          min: 58000,
          upper_quartile: 0,
        },
        tech: "mongodb",
        type_statistics: {
          freelance: 12,
          full_time: 123,
          part_time: 1,
        },
      },
      {
        count: 122,
        location_statistics: {
          hybrid: 51,
          office: 29,
          remote: 42,
        },
        popularity: 0.007206568494439125,
        popularity_statistics: [],
        salary_statistics: {
          all: [195000],
          lower_quartile: 0,
          max: 195000,
          median: 195000,
          min: 195000,
          upper_quartile: 0,
        },
        tech: "microservic",
        type_statistics: {
          freelance: 6,
          full_time: 122,
          part_time: 0,
        },
      },
      {
        count: 121,
        location_statistics: {
          hybrid: 71,
          office: 29,
          remote: 21,
        },
        popularity: 0.007147498428821564,
        popularity_statistics: [],
        salary_statistics: {
          all: [45500, 100000, 100000],
          lower_quartile: 45500,
          max: 100000,
          median: 100000,
          min: 45500,
          upper_quartile: 100000,
        },
        tech: "kubernetes",
        type_statistics: {
          freelance: 7,
          full_time: 121,
          part_time: 1,
        },
      },
      {
        count: 120,
        location_statistics: {
          hybrid: 51,
          office: 25,
          remote: 44,
        },
        popularity: 0.007088428363204002,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "postgresql",
        type_statistics: {
          freelance: 13,
          full_time: 120,
          part_time: 3,
        },
      },
      {
        count: 116,
        location_statistics: {
          hybrid: 62,
          office: 14,
          remote: 40,
        },
        popularity: 0.006852147169411182,
        popularity_statistics: [],
        salary_statistics: {
          all: [100000],
          lower_quartile: 0,
          max: 100000,
          median: 100000,
          min: 100000,
          upper_quartile: 0,
        },
        tech: "aw",
        type_statistics: {
          freelance: 10,
          full_time: 116,
          part_time: 0,
        },
      },
      {
        count: 111,
        location_statistics: {
          hybrid: 62,
          office: 14,
          remote: 35,
        },
        popularity: 0.006556795910000801,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            30000, 32500, 32500, 42500, 46000, 47500, 47500, 47500, 54000, 55000, 55000, 55000,
            57500, 62500, 80000, 107250,
          ],
          lower_quartile: 44250,
          max: 107250,
          median: 50750,
          min: 30000,
          upper_quartile: 56250,
        },
        tech: "laravel",
        type_statistics: {
          freelance: 4,
          full_time: 111,
          part_time: 0,
        },
      },
      {
        count: 107,
        location_statistics: {
          hybrid: 49,
          office: 28,
          remote: 30,
        },
        popularity: 0.006320515181869268,
        popularity_statistics: [],
        salary_statistics: {
          all: [42500, 45000, 46000, 51500, 100000],
          lower_quartile: 43750,
          max: 100000,
          median: 46000,
          min: 42500,
          upper_quartile: 75750,
        },
        tech: "linux",
        type_statistics: {
          freelance: 8,
          full_time: 107,
          part_time: 0,
        },
      },
      {
        count: 105,
        location_statistics: {
          hybrid: 43,
          office: 25,
          remote: 37,
        },
        popularity: 0.006202374584972858,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            42500, 45000, 45000, 52144.9765625, 55000, 62500, 65000, 65000, 75000, 77500, 85000,
            117000, 136500, 143000,
          ],
          lower_quartile: 52144,
          max: 143000,
          median: 65000,
          min: 42500,
          upper_quartile: 85000,
        },
        tech: "node",
        type_statistics: {
          freelance: 16,
          full_time: 105,
          part_time: 2,
        },
      },
      {
        count: 99,
        location_statistics: {
          hybrid: 42,
          office: 30,
          remote: 27,
        },
        popularity: 0.005847953259944916,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "tdd",
        type_statistics: {
          freelance: 3,
          full_time: 99,
          part_time: 0,
        },
      },
      {
        count: 89,
        location_statistics: {
          hybrid: 39,
          office: 29,
          remote: 21,
        },
        popularity: 0.005257250741124153,
        popularity_statistics: [],
        salary_statistics: {
          all: [285000],
          lower_quartile: 0,
          max: 285000,
          median: 285000,
          min: 285000,
          upper_quartile: 0,
        },
        tech: "jquery",
        type_statistics: {
          freelance: 7,
          full_time: 89,
          part_time: 3,
        },
      },
      {
        count: 87,
        location_statistics: {
          hybrid: 40,
          office: 28,
          remote: 19,
        },
        popularity: 0.0051391106098890305,
        popularity_statistics: [],
        salary_statistics: {
          all: [55000, 57500, 67500, 67500, 77500, 80000],
          lower_quartile: 57500,
          max: 80000,
          median: 67500,
          min: 55000,
          upper_quartile: 77500,
        },
        tech: "rest",
        type_statistics: {
          freelance: 7,
          full_time: 87,
          part_time: 1,
        },
      },
      {
        count: 82,
        location_statistics: {
          hybrid: 34,
          office: 28,
          remote: 20,
        },
        popularity: 0.004843759350478649,
        popularity_statistics: [],
        salary_statistics: {
          all: [37500, 50000, 55000, 55000, 70000, 130000],
          lower_quartile: 50000,
          max: 130000,
          median: 55000,
          min: 37500,
          upper_quartile: 70000,
        },
        tech: "vue",
        type_statistics: {
          freelance: 2,
          full_time: 82,
          part_time: 2,
        },
      },
      {
        count: 81,
        location_statistics: {
          hybrid: 43,
          office: 15,
          remote: 23,
        },
        popularity: 0.0047846888191998005,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "entity framework",
        type_statistics: {
          freelance: 0,
          full_time: 81,
          part_time: 0,
        },
      },
      {
        count: 80,
        location_statistics: {
          hybrid: 38,
          office: 30,
          remote: 12,
        },
        popularity: 0.004725618753582239,
        popularity_statistics: [],
        salary_statistics: {
          all: [50000, 52500, 60000, 92500],
          lower_quartile: 51250,
          max: 92500,
          median: 56250,
          min: 50000,
          upper_quartile: 76250,
        },
        tech: "spring",
        type_statistics: {
          freelance: 14,
          full_time: 80,
          part_time: 0,
        },
      },
      {
        count: 79,
        location_statistics: {
          hybrid: 44,
          office: 22,
          remote: 13,
        },
        popularity: 0.004666548687964678,
        popularity_statistics: [],
        salary_statistics: {
          all: [47500, 47500, 57500, 58788.83984375, 61500, 67500, 70000, 85000],
          lower_quartile: 52500,
          max: 85000,
          median: 60144,
          min: 47500,
          upper_quartile: 68750,
        },
        tech: "agile",
        type_statistics: {
          freelance: 4,
          full_time: 79,
          part_time: 0,
        },
      },
      {
        count: 78,
        location_statistics: {
          hybrid: 37,
          office: 15,
          remote: 26,
        },
        popularity: 0.004607478156685829,
        popularity_statistics: [],
        salary_statistics: {
          all: [72500, 72500, 102500, 102500, 102500, 102500, 133640, 156000],
          lower_quartile: 87500,
          max: 156000,
          median: 102500,
          min: 72500,
          upper_quartile: 118070,
        },
        tech: "gcp",
        type_statistics: {
          freelance: 5,
          full_time: 78,
          part_time: 1,
        },
      },
      {
        count: 76,
        location_statistics: {
          hybrid: 45,
          office: 14,
          remote: 17,
        },
        popularity: 0.0044893380254507065,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "bootstrap",
        type_statistics: {
          freelance: 3,
          full_time: 76,
          part_time: 1,
        },
      },
      {
        count: 75,
        location_statistics: {
          hybrid: 32,
          office: 17,
          remote: 26,
        },
        popularity: 0.004430267494171858,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "graphql",
        type_statistics: {
          freelance: 9,
          full_time: 75,
          part_time: 2,
        },
      },
      {
        count: 72,
        location_statistics: {
          hybrid: 35,
          office: 17,
          remote: 20,
        },
        popularity: 0.0042530568316578865,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "elasticsearch",
        type_statistics: {
          freelance: 4,
          full_time: 72,
          part_time: 0,
        },
      },
      {
        count: 69,
        location_statistics: {
          hybrid: 33,
          office: 15,
          remote: 21,
        },
        popularity: 0.004075846169143915,
        popularity_statistics: [],
        salary_statistics: {
          all: [57500, 72000],
          lower_quartile: 57500,
          max: 72000,
          median: 64750,
          min: 57500,
          upper_quartile: 72000,
        },
        tech: "terraform",
        type_statistics: {
          freelance: 11,
          full_time: 69,
          part_time: 0,
        },
      },
      {
        count: 67,
        location_statistics: {
          hybrid: 33,
          office: 17,
          remote: 17,
        },
        popularity: 0.003957705572247505,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            32500, 40000, 40000, 40000, 40000, 42500, 42500, 42500, 42500, 45000, 47500, 47500,
            50000, 50000, 50000, 52492.796875, 52492.796875, 52500, 52500, 52500, 54000, 55000,
            55000, 55000, 55000, 55000, 55000, 55000, 57500, 60000, 60000, 60000, 60000, 60000,
            60000, 60000, 60000, 60000, 60000, 60000, 62500, 62500, 65000, 65000, 70000, 70000,
            70000, 72500, 72500, 80000, 95000, 100611.203125, 130000,
          ],
          lower_quartile: 50000,
          max: 130000,
          median: 55000,
          min: 32500,
          upper_quartile: 61250,
        },
        tech: "blazor",
        type_statistics: {
          freelance: 0,
          full_time: 67,
          part_time: 0,
        },
      },
      {
        count: 65,
        location_statistics: {
          hybrid: 32,
          office: 14,
          remote: 19,
        },
        popularity: 0.003839565208181739,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "bdd",
        type_statistics: {
          freelance: 2,
          full_time: 65,
          part_time: 0,
        },
      },
      {
        count: 63,
        location_statistics: {
          hybrid: 30,
          office: 11,
          remote: 22,
        },
        popularity: 0.0037214248441159725,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            40000, 40000, 45000, 46060, 53000, 53000, 54000, 54000, 60000, 62500, 67500, 72500,
            72500, 75000, 92500, 95000, 95000, 149500, 149500,
          ],
          lower_quartile: 53000,
          max: 149500,
          median: 62500,
          min: 40000,
          upper_quartile: 92500,
        },
        tech: "react js",
        type_statistics: {
          freelance: 9,
          full_time: 63,
          part_time: 2,
        },
      },
      {
        count: 57,
        location_statistics: {
          hybrid: 26,
          office: 13,
          remote: 18,
        },
        popularity: 0.003367003286257386,
        popularity_statistics: [],
        salary_statistics: {
          all: [42500, 50000],
          lower_quartile: 42500,
          max: 50000,
          median: 46250,
          min: 42500,
          upper_quartile: 50000,
        },
        tech: "asp mvc",
        type_statistics: {
          freelance: 1,
          full_time: 57,
          part_time: 0,
        },
      },
      {
        count: 55,
        location_statistics: {
          hybrid: 26,
          office: 10,
          remote: 19,
        },
        popularity: 0.00324886292219162,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "kubernet",
        type_statistics: {
          freelance: 8,
          full_time: 55,
          part_time: 0,
        },
      },
      {
        count: 55,
        location_statistics: {
          hybrid: 24,
          office: 17,
          remote: 14,
        },
        popularity: 0.00324886292219162,
        popularity_statistics: [],
        salary_statistics: {
          all: [57500],
          lower_quartile: 0,
          max: 57500,
          median: 57500,
          min: 57500,
          upper_quartile: 0,
        },
        tech: "jenkins",
        type_statistics: {
          freelance: 16,
          full_time: 55,
          part_time: 0,
        },
      },
      {
        count: 55,
        location_statistics: {
          hybrid: 25,
          office: 18,
          remote: 12,
        },
        popularity: 0.00324886292219162,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "linq",
        type_statistics: {
          freelance: 2,
          full_time: 55,
          part_time: 0,
        },
      },
      {
        count: 55,
        location_statistics: {
          hybrid: 23,
          office: 12,
          remote: 20,
        },
        popularity: 0.00324886292219162,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            30000, 70000, 70000, 70000, 70000, 85000, 90000, 90000, 95000, 95000, 107500, 115000,
            115000, 115000, 115000, 120000,
          ],
          lower_quartile: 70000,
          max: 120000,
          median: 92500,
          min: 30000,
          upper_quartile: 115000,
        },
        tech: "kotlin",
        type_statistics: {
          freelance: 3,
          full_time: 55,
          part_time: 0,
        },
      },
      {
        count: 54,
        location_statistics: {
          hybrid: 27,
          office: 15,
          remote: 12,
        },
        popularity: 0.003189792623743415,
        popularity_statistics: [],
        salary_statistics: {
          all: [40000, 45000, 45000, 55000, 60000],
          lower_quartile: 42500,
          max: 60000,
          median: 45000,
          min: 40000,
          upper_quartile: 57500,
        },
        tech: "jira",
        type_statistics: {
          freelance: 6,
          full_time: 54,
          part_time: 0,
        },
      },
      {
        count: 53,
        location_statistics: {
          hybrid: 34,
          office: 6,
          remote: 13,
        },
        popularity: 0.00313072232529521,
        popularity_statistics: [],
        salary_statistics: {
          all: [120000, 125000],
          lower_quartile: 120000,
          max: 125000,
          median: 122500,
          min: 120000,
          upper_quartile: 125000,
        },
        tech: "django",
        type_statistics: {
          freelance: 7,
          full_time: 53,
          part_time: 2,
        },
      },
      {
        count: 53,
        location_statistics: {
          hybrid: 17,
          office: 8,
          remote: 28,
        },
        popularity: 0.00313072232529521,
        popularity_statistics: [],
        salary_statistics: {
          all: [65000],
          lower_quartile: 0,
          max: 65000,
          median: 65000,
          min: 65000,
          upper_quartile: 0,
        },
        tech: "redux",
        type_statistics: {
          freelance: 6,
          full_time: 53,
          part_time: 0,
        },
      },
      {
        count: 50,
        location_statistics: {
          hybrid: 26,
          office: 18,
          remote: 6,
        },
        popularity: 0.0029535116627812386,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "spring boot",
        type_statistics: {
          freelance: 7,
          full_time: 50,
          part_time: 0,
        },
      },
      {
        count: 50,
        location_statistics: {
          hybrid: 23,
          office: 13,
          remote: 14,
        },
        popularity: 0.0029535116627812386,
        popularity_statistics: [],
        salary_statistics: {
          all: [47500, 62500, 70000, 92500],
          lower_quartile: 55000,
          max: 92500,
          median: 66250,
          min: 47500,
          upper_quartile: 81250,
        },
        tech: "agil",
        type_statistics: {
          freelance: 1,
          full_time: 50,
          part_time: 2,
        },
      },
      {
        count: 48,
        location_statistics: {
          hybrid: 19,
          office: 17,
          remote: 12,
        },
        popularity: 0.0028353712987154722,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "json",
        type_statistics: {
          freelance: 8,
          full_time: 48,
          part_time: 1,
        },
      },
      {
        count: 47,
        location_statistics: {
          hybrid: 15,
          office: 25,
          remote: 7,
        },
        popularity: 0.0027763010002672672,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "lambda",
        type_statistics: {
          freelance: 7,
          full_time: 47,
          part_time: 1,
        },
      },
      {
        count: 46,
        location_statistics: {
          hybrid: 24,
          office: 17,
          remote: 5,
        },
        popularity: 0.0027172307018190622,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "kafka",
        type_statistics: {
          freelance: 6,
          full_time: 46,
          part_time: 0,
        },
      },
      {
        count: 46,
        location_statistics: {
          hybrid: 15,
          office: 23,
          remote: 8,
        },
        popularity: 0.0027172307018190622,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            40000, 45000, 45500, 60000, 60000, 70000, 70000, 70000, 70000, 70000, 90000, 95000,
            95000, 95000, 95000, 100000, 117000, 123500, 182000,
          ],
          lower_quartile: 60000,
          max: 182000,
          median: 70000,
          min: 40000,
          upper_quartile: 95000,
        },
        tech: "node.js",
        type_statistics: {
          freelance: 10,
          full_time: 46,
          part_time: 0,
        },
      },
      {
        count: 46,
        location_statistics: {
          hybrid: 26,
          office: 12,
          remote: 8,
        },
        popularity: 0.0027172307018190622,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "sass",
        type_statistics: {
          freelance: 4,
          full_time: 46,
          part_time: 1,
        },
      },
      {
        count: 43,
        location_statistics: {
          hybrid: 23,
          office: 9,
          remote: 11,
        },
        popularity: 0.002540020039305091,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "ef core",
        type_statistics: {
          freelance: 0,
          full_time: 43,
          part_time: 0,
        },
      },
      {
        count: 42,
        location_statistics: {
          hybrid: 11,
          office: 4,
          remote: 27,
        },
        popularity: 0.002480949740856886,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            65000, 70000, 80000, 80000, 80000, 80000, 80000, 80000, 96236.796875, 97207, 98938.125,
            99928.125, 100000, 100000, 100000, 100000, 102500, 104074.453125, 104369.375,
            104432.9140625, 109360, 111110, 115000, 142500, 142500, 235000, 235000,
          ],
          lower_quartile: 80000,
          max: 235000,
          median: 100000,
          min: 65000,
          upper_quartile: 109360,
        },
        tech: "rust",
        type_statistics: {
          freelance: 1,
          full_time: 42,
          part_time: 1,
        },
      },
      {
        count: 41,
        location_statistics: {
          hybrid: 30,
          office: 9,
          remote: 2,
        },
        popularity: 0.0024218796752393246,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            42500, 50000, 52500, 60000, 60000, 62500, 65000, 67500, 70000, 70000, 80000, 82500,
            82500, 82500, 156000,
          ],
          lower_quartile: 60000,
          max: 156000,
          median: 67500,
          min: 42500,
          upper_quartile: 82500,
        },
        tech: "wpf",
        type_statistics: {
          freelance: 3,
          full_time: 41,
          part_time: 0,
        },
      },
      {
        count: 41,
        location_statistics: {
          hybrid: 28,
          office: 9,
          remote: 4,
        },
        popularity: 0.0024218796752393246,
        popularity_statistics: [],
        salary_statistics: {
          all: [30000, 52500, 300000],
          lower_quartile: 30000,
          max: 300000,
          median: 52500,
          min: 30000,
          upper_quartile: 300000,
        },
        tech: "selenium",
        type_statistics: {
          freelance: 7,
          full_time: 41,
          part_time: 0,
        },
      },
      {
        count: 40,
        location_statistics: {
          hybrid: 22,
          office: 11,
          remote: 7,
        },
        popularity: 0.0023628093767911196,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "devops",
        type_statistics: {
          freelance: 4,
          full_time: 40,
          part_time: 0,
        },
      },
      {
        count: 39,
        location_statistics: {
          hybrid: 23,
          office: 4,
          remote: 12,
        },
        popularity: 0.0023037390783429146,
        popularity_statistics: [],
        salary_statistics: {
          all: [55000, 100000, 100000],
          lower_quartile: 55000,
          max: 100000,
          median: 100000,
          min: 55000,
          upper_quartile: 100000,
        },
        tech: "core",
        type_statistics: {
          freelance: 2,
          full_time: 39,
          part_time: 0,
        },
      },
      {
        count: 38,
        location_statistics: {
          hybrid: 22,
          office: 9,
          remote: 7,
        },
        popularity: 0.0022446690127253532,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "github",
        type_statistics: {
          freelance: 5,
          full_time: 38,
          part_time: 0,
        },
      },
      {
        count: 38,
        location_statistics: {
          hybrid: 19,
          office: 7,
          remote: 12,
        },
        popularity: 0.0022446690127253532,
        popularity_statistics: [],
        salary_statistics: {
          all: [60000, 77500, 95000, 133250],
          lower_quartile: 68750,
          max: 133250,
          median: 86250,
          min: 60000,
          upper_quartile: 114125,
        },
        tech: "nodej",
        type_statistics: {
          freelance: 4,
          full_time: 38,
          part_time: 1,
        },
      },
      {
        count: 37,
        location_statistics: {
          hybrid: 17,
          office: 12,
          remote: 8,
        },
        popularity: 0.0021855987142771482,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "nosql",
        type_statistics: {
          freelance: 2,
          full_time: 37,
          part_time: 0,
        },
      },
      {
        count: 36,
        location_statistics: {
          hybrid: 16,
          office: 8,
          remote: 12,
        },
        popularity: 0.0021265284158289433,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            30704.80078125, 32500, 35091.203125, 35339.203125, 37500, 40000, 45000, 47500, 50000,
            50000,
          ],
          lower_quartile: 35091,
          max: 50000,
          median: 38750,
          min: 30704,
          upper_quartile: 47500,
        },
        tech: "visual studio",
        type_statistics: {
          freelance: 3,
          full_time: 36,
          part_time: 1,
        },
      },
      {
        count: 35,
        location_statistics: {
          hybrid: 8,
          office: 20,
          remote: 7,
        },
        popularity: 0.0020674581173807383,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "serverless",
        type_statistics: {
          freelance: 3,
          full_time: 35,
          part_time: 0,
        },
      },
      {
        count: 35,
        location_statistics: {
          hybrid: 20,
          office: 5,
          remote: 10,
        },
        popularity: 0.0020674581173807383,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "devop",
        type_statistics: {
          freelance: 2,
          full_time: 35,
          part_time: 0,
        },
      },
      {
        count: 35,
        location_statistics: {
          hybrid: 16,
          office: 10,
          remote: 9,
        },
        popularity: 0.0020674581173807383,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "scss",
        type_statistics: {
          freelance: 1,
          full_time: 35,
          part_time: 1,
        },
      },
      {
        count: 34,
        location_statistics: {
          hybrid: 11,
          office: 12,
          remote: 11,
        },
        popularity: 0.002008388051763177,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "jest",
        type_statistics: {
          freelance: 6,
          full_time: 34,
          part_time: 0,
        },
      },
      {
        count: 33,
        location_statistics: {
          hybrid: 21,
          office: 8,
          remote: 4,
        },
        popularity: 0.001949317753314972,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "jenkin",
        type_statistics: {
          freelance: 5,
          full_time: 33,
          part_time: 0,
        },
      },
      {
        count: 33,
        location_statistics: {
          hybrid: 21,
          office: 8,
          remote: 4,
        },
        popularity: 0.001949317753314972,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "ssrs",
        type_statistics: {
          freelance: 1,
          full_time: 33,
          part_time: 0,
        },
      },
      {
        count: 33,
        location_statistics: {
          hybrid: 20,
          office: 8,
          remote: 5,
        },
        popularity: 0.001949317753314972,
        popularity_statistics: [],
        salary_statistics: {
          all: [32500, 32500, 32500, 33000, 35000, 37500, 37500, 45000, 47500, 50000, 60000, 84500],
          lower_quartile: 32750,
          max: 84500,
          median: 37500,
          min: 32500,
          upper_quartile: 48750,
        },
        tech: "wordpress",
        type_statistics: {
          freelance: 3,
          full_time: 33,
          part_time: 0,
        },
      },
      {
        count: 32,
        location_statistics: {
          hybrid: 14,
          office: 8,
          remote: 10,
        },
        popularity: 0.001890247454866767,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "webpack",
        type_statistics: {
          freelance: 4,
          full_time: 32,
          part_time: 0,
        },
      },
      {
        count: 32,
        location_statistics: {
          hybrid: 20,
          office: 7,
          remote: 5,
        },
        popularity: 0.001890247454866767,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "ssis",
        type_statistics: {
          freelance: 2,
          full_time: 32,
          part_time: 0,
        },
      },
      {
        count: 31,
        location_statistics: {
          hybrid: 14,
          office: 2,
          remote: 15,
        },
        popularity: 0.0018311772728338838,
        popularity_statistics: [],
        salary_statistics: {
          all: [57500, 60000, 77500, 110500, 156000],
          lower_quartile: 58750,
          max: 156000,
          median: 77500,
          min: 57500,
          upper_quartile: 133250,
        },
        tech: "reactj",
        type_statistics: {
          freelance: 3,
          full_time: 30,
          part_time: 7,
        },
      },
      {
        count: 31,
        location_statistics: {
          hybrid: 7,
          office: 6,
          remote: 18,
        },
        popularity: 0.0018311772728338838,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            53093.0390625, 55000, 62500, 72500, 80000, 80000, 80000, 80000, 80000, 85000, 87500,
            95000, 95000,
          ],
          lower_quartile: 67500,
          max: 95000,
          median: 80000,
          min: 53093,
          upper_quartile: 86250,
        },
        tech: "golang",
        type_statistics: {
          freelance: 0,
          full_time: 31,
          part_time: 0,
        },
      },
      {
        count: 30,
        location_statistics: {
          hybrid: 14,
          office: 10,
          remote: 6,
        },
        popularity: 0.0017721070908010006,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "nodejs",
        type_statistics: {
          freelance: 1,
          full_time: 30,
          part_time: 0,
        },
      },
      {
        count: 30,
        location_statistics: {
          hybrid: 10,
          office: 12,
          remote: 8,
        },
        popularity: 0.0017721070908010006,
        popularity_statistics: [],
        salary_statistics: {
          all: [90000],
          lower_quartile: 0,
          max: 90000,
          median: 90000,
          min: 90000,
          upper_quartile: 0,
        },
        tech: "soap",
        type_statistics: {
          freelance: 7,
          full_time: 30,
          part_time: 0,
        },
      },
      {
        count: 30,
        location_statistics: {
          hybrid: 14,
          office: 10,
          remote: 6,
        },
        popularity: 0.0017721070908010006,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "cypress",
        type_statistics: {
          freelance: 4,
          full_time: 30,
          part_time: 0,
        },
      },
      {
        count: 29,
        location_statistics: {
          hybrid: 7,
          office: 16,
          remote: 6,
        },
        popularity: 0.0017130367923527956,
        popularity_statistics: [],
        salary_statistics: {
          all: [47500, 57500, 72500, 80000, 85000, 85000, 247000],
          lower_quartile: 57500,
          max: 247000,
          median: 80000,
          min: 47500,
          upper_quartile: 85000,
        },
        tech: "react native",
        type_statistics: {
          freelance: 1,
          full_time: 29,
          part_time: 0,
        },
      },
      {
        count: 29,
        location_statistics: {
          hybrid: 19,
          office: 3,
          remote: 7,
        },
        popularity: 0.0017130367923527956,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "rabbitmq",
        type_statistics: {
          freelance: 0,
          full_time: 29,
          part_time: 0,
        },
      },
      {
        count: 29,
        location_statistics: {
          hybrid: 20,
          office: 5,
          remote: 4,
        },
        popularity: 0.0017130367923527956,
        popularity_statistics: [],
        salary_statistics: {
          all: [65000],
          lower_quartile: 0,
          max: 65000,
          median: 65000,
          min: 65000,
          upper_quartile: 0,
        },
        tech: "ssas",
        type_statistics: {
          freelance: 1,
          full_time: 29,
          part_time: 0,
        },
      },
      {
        count: 29,
        location_statistics: {
          hybrid: 15,
          office: 9,
          remote: 5,
        },
        popularity: 0.0017130367923527956,
        popularity_statistics: [],
        salary_statistics: {
          all: [33000, 35000, 40000, 50000, 52500, 54000, 54000, 55000, 72500, 90000],
          lower_quartile: 40000,
          max: 90000,
          median: 53250,
          min: 33000,
          upper_quartile: 55000,
        },
        tech: "asp core",
        type_statistics: {
          freelance: 2,
          full_time: 29,
          part_time: 0,
        },
      },
      {
        count: 29,
        location_statistics: {
          hybrid: 13,
          office: 10,
          remote: 6,
        },
        popularity: 0.0017130367923527956,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "gitlab",
        type_statistics: {
          freelance: 4,
          full_time: 29,
          part_time: 0,
        },
      },
      {
        count: 29,
        location_statistics: {
          hybrid: 8,
          office: 16,
          remote: 5,
        },
        popularity: 0.0017130367923527956,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "dynamodb",
        type_statistics: {
          freelance: 4,
          full_time: 29,
          part_time: 1,
        },
      },
      {
        count: 28,
        location_statistics: {
          hybrid: 18,
          office: 3,
          remote: 7,
        },
        popularity: 0.0016539666103199124,
        popularity_statistics: [],
        salary_statistics: {
          all: [57500, 60000],
          lower_quartile: 57500,
          max: 60000,
          median: 58750,
          min: 57500,
          upper_quartile: 60000,
        },
        tech: "symfoni",
        type_statistics: {
          freelance: 0,
          full_time: 28,
          part_time: 0,
        },
      },
      {
        count: 28,
        location_statistics: {
          hybrid: 12,
          office: 6,
          remote: 10,
        },
        popularity: 0.0016539666103199124,
        popularity_statistics: [],
        salary_statistics: {
          all: [40000, 100000, 102500, 136500, 136500],
          lower_quartile: 70000,
          max: 136500,
          median: 102500,
          min: 40000,
          upper_quartile: 136500,
        },
        tech: "js",
        type_statistics: {
          freelance: 6,
          full_time: 28,
          part_time: 0,
        },
      },
      {
        count: 28,
        location_statistics: {
          hybrid: 13,
          office: 8,
          remote: 7,
        },
        popularity: 0.0016539666103199124,
        popularity_statistics: [],
        salary_statistics: {
          all: [44000, 47500, 65000, 72500, 72500, 77500, 77500, 80500, 85000],
          lower_quartile: 56250,
          max: 85000,
          median: 72500,
          min: 44000,
          upper_quartile: 79000,
        },
        tech: "full stack",
        type_statistics: {
          freelance: 1,
          full_time: 28,
          part_time: 0,
        },
      },
      {
        count: 27,
        location_statistics: {
          hybrid: 6,
          office: 18,
          remote: 3,
        },
        popularity: 0.0015948963118717074,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "s3",
        type_statistics: {
          freelance: 4,
          full_time: 27,
          part_time: 0,
        },
      },
      {
        count: 27,
        location_statistics: {
          hybrid: 11,
          office: 4,
          remote: 12,
        },
        popularity: 0.0015948963118717074,
        popularity_statistics: [],
        salary_statistics: {
          all: [60000, 60000, 80000, 100000],
          lower_quartile: 60000,
          max: 100000,
          median: 70000,
          min: 60000,
          upper_quartile: 90000,
        },
        tech: "backend",
        type_statistics: {
          freelance: 2,
          full_time: 27,
          part_time: 0,
        },
      },
      {
        count: 25,
        location_statistics: {
          hybrid: 6,
          office: 18,
          remote: 1,
        },
        popularity: 0.0014767558313906193,
        popularity_statistics: [],
        salary_statistics: {
          all: [40000, 42500, 45000, 45000],
          lower_quartile: 41250,
          max: 45000,
          median: 43750,
          min: 40000,
          upper_quartile: 45000,
        },
        tech: "vmware",
        type_statistics: {
          freelance: 1,
          full_time: 25,
          part_time: 0,
        },
      },
      {
        count: 25,
        location_statistics: {
          hybrid: 11,
          office: 11,
          remote: 3,
        },
        popularity: 0.0014767558313906193,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "maven",
        type_statistics: {
          freelance: 3,
          full_time: 25,
          part_time: 0,
        },
      },
      {
        count: 24,
        location_statistics: {
          hybrid: 16,
          office: 5,
          remote: 3,
        },
        popularity: 0.0014176856493577361,
        popularity_statistics: [],
        salary_statistics: {
          all: [75000],
          lower_quartile: 0,
          max: 75000,
          median: 75000,
          min: 75000,
          upper_quartile: 0,
        },
        tech: "express",
        type_statistics: {
          freelance: 3,
          full_time: 24,
          part_time: 0,
        },
      },
      {
        count: 24,
        location_statistics: {
          hybrid: 14,
          office: 6,
          remote: 4,
        },
        popularity: 0.0014176856493577361,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "junit",
        type_statistics: {
          freelance: 1,
          full_time: 24,
          part_time: 0,
        },
      },
      {
        count: 23,
        location_statistics: {
          hybrid: 7,
          office: 9,
          remote: 7,
        },
        popularity: 0.0013586153509095311,
        popularity_statistics: [],
        salary_statistics: {
          all: [70000, 77500, 77500, 90000],
          lower_quartile: 73750,
          max: 90000,
          median: 77500,
          min: 70000,
          upper_quartile: 83750,
        },
        tech: "vuej",
        type_statistics: {
          freelance: 0,
          full_time: 23,
          part_time: 0,
        },
      },
      {
        count: 23,
        location_statistics: {
          hybrid: 6,
          office: 14,
          remote: 3,
        },
        popularity: 0.0013586153509095311,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "multithread",
        type_statistics: {
          freelance: 0,
          full_time: 23,
          part_time: 0,
        },
      },
      {
        count: 23,
        location_statistics: {
          hybrid: 11,
          office: 8,
          remote: 4,
        },
        popularity: 0.0013586153509095311,
        popularity_statistics: [],
        salary_statistics: {
          all: [90000, 110000, 110000],
          lower_quartile: 90000,
          max: 110000,
          median: 110000,
          min: 90000,
          upper_quartile: 110000,
        },
        tech: "react nativ",
        type_statistics: {
          freelance: 0,
          full_time: 23,
          part_time: 0,
        },
      },
      {
        count: 22,
        location_statistics: {
          hybrid: 16,
          office: 3,
          remote: 3,
        },
        popularity: 0.001299545168876648,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "flask",
        type_statistics: {
          freelance: 1,
          full_time: 22,
          part_time: 0,
        },
      },
      {
        count: 22,
        location_statistics: {
          hybrid: 15,
          office: 1,
          remote: 6,
        },
        popularity: 0.001299545168876648,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "entiti framework",
        type_statistics: {
          freelance: 1,
          full_time: 22,
          part_time: 0,
        },
      },
      {
        count: 22,
        location_statistics: {
          hybrid: 12,
          office: 6,
          remote: 4,
        },
        popularity: 0.001299545168876648,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "scrum",
        type_statistics: {
          freelance: 1,
          full_time: 22,
          part_time: 0,
        },
      },
      {
        count: 22,
        location_statistics: {
          hybrid: 12,
          office: 3,
          remote: 7,
        },
        popularity: 0.001299545168876648,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "springboot",
        type_statistics: {
          freelance: 1,
          full_time: 22,
          part_time: 0,
        },
      },
      {
        count: 21,
        location_statistics: {
          hybrid: 0,
          office: 12,
          remote: 9,
        },
        popularity: 0.001240474870428443,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            21001.5, 21450, 24500, 27500, 27500, 27500, 27500, 27836.25, 36600, 36774, 75000,
            110000, 115000, 115000, 136500, 136500, 136500, 136500, 136500, 136500,
          ],
          lower_quartile: 27500,
          max: 136500,
          median: 55887,
          min: 21001,
          upper_quartile: 136500,
        },
        tech: "null",
        type_statistics: {
          freelance: 8,
          full_time: 15,
          part_time: 6,
        },
      },
      {
        count: 21,
        location_statistics: {
          hybrid: 8,
          office: 5,
          remote: 8,
        },
        popularity: 0.001240474870428443,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "unix",
        type_statistics: {
          freelance: 3,
          full_time: 21,
          part_time: 0,
        },
      },
      {
        count: 20,
        location_statistics: {
          hybrid: 13,
          office: 6,
          remote: 1,
        },
        popularity: 0.0011814046883955598,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "etl",
        type_statistics: {
          freelance: 3,
          full_time: 20,
          part_time: 0,
        },
      },
      {
        count: 20,
        location_statistics: {
          hybrid: 0,
          office: 0,
          remote: 20,
        },
        popularity: 0.0011814046883955598,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "gdpr",
        type_statistics: {
          freelance: 0,
          full_time: 20,
          part_time: 0,
        },
      },
      {
        count: 20,
        location_statistics: {
          hybrid: 8,
          office: 8,
          remote: 4,
        },
        popularity: 0.0011814046883955598,
        popularity_statistics: [],
        salary_statistics: {
          all: [],
          lower_quartile: 0,
          max: 0,
          median: 0,
          min: 0,
          upper_quartile: 0,
        },
        tech: "android",
        type_statistics: {
          freelance: 1,
          full_time: 20,
          part_time: 0,
        },
      },
      {
        count: 20,
        location_statistics: {
          hybrid: 0,
          office: 0,
          remote: 20,
        },
        popularity: 0.0011814046883955598,
        popularity_statistics: [],
        salary_statistics: {
          all: [
            77500, 77500, 77500, 77500, 77500, 77500, 77500, 77500, 77500, 77500, 77500, 77500,
            77500, 77500, 77500, 77500, 77500, 77500, 77500, 77500,
          ],
          lower_quartile: 77500,
          max: 77500,
          median: 77500,
          min: 77500,
          upper_quartile: 77500,
        },
        tech: "oss",
        type_statistics: {
          freelance: 0,
          full_time: 20,
          part_time: 0,
        },
      },
      {
        count: 20,
        location_statistics: {
          hybrid: 4,
          office: 12,
          remote: 4,
        },
        popularity: 0.0011814046883955598,
        popularity_statistics: [],
        salary_statistics: {
          all: [135200],
          lower_quartile: 0,
          max: 135200,
          median: 135200,
          min: 135200,
          upper_quartile: 0,
        },
        tech: "crm",
        type_statistics: {
          freelance: 1,
          full_time: 20,
          part_time: 0,
        },
      },
      {
        count: 20,
        location_statistics: {
          hybrid: 8,
          office: 7,
          remote: 5,
        },
        popularity: 0.0011814046883955598,
        popularity_statistics: [],
        salary_statistics: {
          all: [65000, 67500],
          lower_quartile: 65000,
          max: 67500,
          median: 66250,
          min: 65000,
          upper_quartile: 67500,
        },
        tech: "cms",
        type_statistics: {
          freelance: 1,
          full_time: 20,
          part_time: 0,
        },
      },
    ],
  };

  return {
    props:
      (statistics as any).error === true
        ? { error: true }
        : {
            statistics: statistics as PositionStatistics,
            position: preset_position,
          },
    revalidate: 120,
  };
}

const presets = {
  position: { all: "", frontend: "frontend,front-end,front,css" },
  start_date: { start: "" },
  end_date: { end: "" },
  count_threshold: { all: 20 },
};
