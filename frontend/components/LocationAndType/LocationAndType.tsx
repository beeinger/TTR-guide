import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { LocationStatistics, TypeStatistics } from "shared/types";
import { VictoryChart, VictoryBar, VictoryAxis } from "victory";

export default function LocationAndType({
  location,
  type,
  maxValues,
}: {
  location: LocationStatistics;
  type: TypeStatistics;
  maxValues: {
    popularity: number;
    location: number;
    type: number;
  };
}) {
  const data = useMemo(
    () => [
      {
        data: [
          { x: "Remote", y: location.remote },
          { x: "Office", y: location.office },
          { x: "Hybrid", y: location.hybrid },
        ],
        color: "#3498db",
        max: maxValues.location,
      },
      {
        data: [
          { x: "Full time", y: type.full_time },
          { x: "Part time", y: type.part_time },
          { x: "Freelance", y: type.freelance },
        ],
        color: "#2ecc71",
        max: maxValues.type,
      },
    ],
    [location, type, maxValues]
  );

  return (
    <Container>
      {data.map((item) => (
        <VictoryChart
          key={item.color}
          height={120}
          width={160}
          domain={{ y: [0, item.max] }}
          domainPadding={{ x: 25 }}
          padding={{ top: 20, bottom: 20, left: 5, right: 5 }}
        >
          <VictoryAxis
            style={{
              tickLabels: { fill: "white", fontSize: 10, opacity: 0.5 },
            }}
          />
          <VictoryBar
            data={item.data}
            x="x"
            y="y"
            style={{
              data: { fill: item.color },
              labels: { fill: "white", opacity: 0.25, fontSize: 10 },
            }}
            barWidth={40}
            labels={({ datum }) => datum.y}
          />
        </VictoryChart>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  margin-top: 8px;

  & > *:not(:last-child) {
    margin-bottom: 8px;
  }
`;
