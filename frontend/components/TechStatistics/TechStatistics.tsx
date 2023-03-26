import React from "react";
import { TechStatistics } from "shared/types";

export default function TechStatistic({
  tech,
  popularity,
  count,
  location_statistics,
  type_statistics,
  salary_statistics,
  popularity_statistics,
}: TechStatistics) {
  return (
    <div>
      <div>{tech}</div>
      <div>{popularity * 100}%</div>
    </div>
  );
}
