import styled from "@emotion/styled";
import { SalaryStatistics } from "shared/types";
import { VictoryBoxPlot, VictoryChart, VictoryAxis, VictoryTooltip } from "victory";

export default function Salary({ salary }: { salary: SalaryStatistics }) {
  return (
    <Layout>
      <Container>
        <VictoryChart
          height={100}
          width={50}
          domain={{ y: [0, 150_000] }}
          padding={{ top: 10, bottom: 10, left: 40 }}
        >
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => `£${x / 1000}k`}
            tickValues={[0, 50_000, 100_000, 150_000]}
            style={{
              axis: { stroke: "none" },
              ticks: { stroke: "white", strokeWidth: 0.2, size: 15 },
              tickLabels: { fill: "white", fontSize: 8, opacity: 0.5 },
            }}
          />
          <VictoryBoxPlot
            boxWidth={20}
            labelComponent={<VictoryTooltip />}
            style={{
              min: { stroke: "white", strokeWidth: 0.5 },
              max: { stroke: "white", strokeWidth: 0.5 },
              q1: { fill: "white" },
              q3: { fill: "white" },
              median: { stroke: "black", strokeWidth: 3 },
              whiskers: { stroke: "white", strokeWidth: 1 },
              labels: { fill: "white", fontSize: 10 },
            }}
            data={[
              {
                y: [
                  salary.min,
                  salary.lower_quartile,
                  salary.median,
                  salary.upper_quartile,
                  salary.max,
                ],
              },
            ]}
          />
        </VictoryChart>
      </Container>
      <Median>
        <h4>£{Math.ceil(salary.median / 1000)}k</h4>
        <span>median</span>
        <span>salary</span>
      </Median>
    </Layout>
  );
}

const Median = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;

  > h4 {
    margin: 0;
    font-size: 1.8rem;
    font-family: "TrapBlack";
  }

  > span {
    margin-top: -4px;
    font-size: 1rem;
    font-family: "TrapLight";
    opacity: 0.5;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100px;
`;

const Layout = styled.div`
  display: flex;
  height: 200px;

  justify-content: center;
  align-items: center;

  gap: 8px;

  margin-top: 8px;
`;
