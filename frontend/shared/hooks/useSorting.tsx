import { useEffect, useState } from "react";
import { TechStatistics } from "shared/types";

const sortingFunctions = {
  popularityDesc: (a, b) => b.popularity - a.popularity,
  popularityAsc: (a, b) => a.popularity - b.popularity,
  highestMedianSalaryDesc: (a, b) => b.salary_statistics.median - a.salary_statistics.median,
  highestMedianSalaryAsc: (a, b) => a.salary_statistics.median - b.salary_statistics.median,
};

const filterAndSort = (techStatistics: TechStatistics[], sortingFunction: (a, b) => number) =>
  techStatistics?.filter((value) => !EXCLUSIONS.includes(value.tech)).sort(sortingFunction) || [];

export default function useSorting(_techStatistics: TechStatistics[]) {
  const [sorting, setSorting] = useState<keyof typeof sortingFunctions>("popularityDesc");
  const [techStatistics, setTechStatistics] = useState(() =>
    filterAndSort(_techStatistics, sortingFunctions[sorting])
  );

  useEffect(() => {
    console.log("aaa");
    setTechStatistics(filterAndSort(_techStatistics, sortingFunctions[sorting]));
  }, [sorting, _techStatistics]);

  return [techStatistics, setSorting] as const;
}

const EXCLUSIONS = [
  "null",
  "iphone",
  "smartphone",
  "ios",
  "android",
  "azur",
  "network",
  "software",
];
