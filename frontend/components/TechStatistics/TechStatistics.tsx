import styled from "@emotion/styled";
import LocationAndType from "components/LocationAndType";
import React, { useMemo } from "react";
import { TechStatistics } from "shared/types";
import Salary from "components/Salary";

export default function TechStatistic({
  tech: _tech,
  maxValues,
}: {
  tech: TechStatistics;
  maxValues: {
    popularity: number;
    location: number;
    type: number;
  };
}) {
  const { tech, popularity, count, salary_statistics, location_statistics, type_statistics } =
    useMemo(() => _tech, [_tech]);
  const popularityPercentage = useMemo(() => ((popularity || 0) * 100).toFixed(1), [popularity]);

  return (
    <Container maxPopularity={maxValues.popularity} popularity={popularity}>
      <Popularity>{popularityPercentage}%</Popularity>
      <Count>{count} jobs</Count>
      <Title>{tech}</Title>
      <Salary salary={salary_statistics} />
      <LocationAndType
        location={location_statistics}
        type={type_statistics}
        maxValues={maxValues}
      />
    </Container>
  );
}

const Container = styled.div<{ popularity: number; maxPopularity: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 400px;
  opacity: ${({ popularity, maxPopularity }) =>
    1 - maxPopularity + popularity - (maxPopularity - popularity) * 2 || 1};
`;

const Title = styled.h2`
  margin: 0;
  margin-bottom: 8px;
  font-size: 2rem;
  text-transform: capitalize;
`;

const Popularity = styled.h1`
  margin: 0;
  font-size: 3rem;
  font-family: "TrapBlack";
  color: #00c8f8;
`;

const Count = styled.h3`
  margin-top: -4px;
  font-size: 1rem;
  font-family: "TrapLight";
  opacity: 0.5;
  margin-bottom: 8px;
`;
