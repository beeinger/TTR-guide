import styled from "@emotion/styled";
import { FiChevronDown } from "react-icons/fi";

const sortingAvaliable = [
  {
    name: "Popularity (desc)",
    value: "popularityDesc",
  },
  {
    name: "Popularity (asc)",
    value: "popularityAsc",
  },
  {
    name: "Median salary (desc)",
    value: "highestMedianSalaryDesc",
  },
  {
    name: "Median salary (asc)",
    value: "highestMedianSalaryAsc",
  },
];

export default function Sorting({
  setSorting,
}: {
  setSorting: React.Dispatch<
    React.SetStateAction<
      "popularityDesc" | "popularityAsc" | "highestMedianSalaryDesc" | "highestMedianSalaryAsc"
    >
  >;
}) {
  return (
    <SelectSortingContainer>
      <SelectSorting onChange={(e) => setSorting(e.target.value as any)}>
        {sortingAvaliable.map(({ name, value }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </SelectSorting>
      <FiChevronDown />
    </SelectSortingContainer>
  );
}
const SelectSortingContainer = styled.div`
  position: relative;
  width: min-content;
  height: min-content;

  grid-area: sorting;
  justify-self: center;
  align-self: center;

  > svg {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #00c8f8;
    pointer-events: none;
  }
`;

const SelectSorting = styled.select`
  height: 40px;
  border: 1px solid #00c8f8;
  border-radius: 4px;
  padding: 0 10px;
  padding-right: 30px;
  padding-top: 0.2em;
  font-size: 16px;
  font-weight: 600;
  background: transparent;
  appearance: none;
  outline: none;
  cursor: pointer;
  color: white;

  transition: all 0.2s ease-in-out;

  &:hover {
    outline: 1px solid #00c8f8;
  }

  &:focus {
    outline: 1px solid #00c8f8;
  }
`;
