import { useCallback, useMemo, useState } from "react";
import { TechStatistics } from "shared/types";

const sortingFunctions = {
  popularityDesc: (a, b) => b.popularity - a.popularity,
  popularityAsc: (a, b) => a.popularity - b.popularity,
  highestMedianSalaryDesc: (a, b) => b.salary_statistics.median - a.salary_statistics.median,
  highestMedianSalaryAsc: (a, b) => a.salary_statistics.median - b.salary_statistics.median,
};

export default function useSorting(tech_statistics: TechStatistics[]) {
  const [sorting, setSorting] = useState<keyof typeof sortingFunctions>("popularityDesc");
  const sortingFunction = useCallback(sortingFunctions[sorting], [sorting]);
  const techStatistics = useMemo(
    () => tech_statistics?.sort(sortingFunction) || [],
    [tech_statistics, sortingFunction]
  );

  return [techStatistics, setSorting] as const;
}
