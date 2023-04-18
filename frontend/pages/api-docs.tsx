import styled from "@emotion/styled";
import axios from "axios";
import React, { useState } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { StatisticsResponse } from "shared/types";
import SyntaxHighlighter from "react-syntax-highlighter";
import atelierDuneDark from "shared/dark-theme";
import Head from "next/head";
import { shortTitle } from "./_document";

const onChangeWrapper =
  (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setter(e.target.value);

const NO_PARAMS = "- no params needed -";
const API_URL = "https://api.ttr.guide/";

export default function Api() {
  const [queryParams, setQueryParams] = useState<Record<string, string>>({
    positions: "frontend,front-end,front,css,react,vue,angular,html",
    start_date: "30/01/2021",
    end_date: "",
    count_threshold: "2",
  });
  const [executing, setExecuting] = useState(false);
  const [response, setResponse] = useState<
    | StatisticsResponse
    | {
        error: boolean;
        message: any;
      }
    | null
  >(null);

  const setPositions = (positions: string) => setQueryParams((q) => ({ ...q, positions })),
    setStartDate = (start_date: string) => setQueryParams((q) => ({ ...q, start_date })),
    setEndDate = (end_date: string) => setQueryParams((q) => ({ ...q, end_date })),
    setCountThreshold = (count_threshold: string) =>
      setQueryParams((q) => ({ ...q, count_threshold }));

  const getURLSearchParams = (params: Record<string, string>) => {
      const urlSearchParams = new URLSearchParams(
        Object.entries(params).filter(([_, value]) => value !== "")
      ).toString();

      return urlSearchParams ? `?${urlSearchParams}` : NO_PARAMS;
    },
    copy = (text: string) => () => text !== NO_PARAMS && navigator.clipboard.writeText(text);

  const executeRequest = async () => {
    setExecuting(true);

    const statistics = await axios
      .get<StatisticsResponse>(API_URL + "statistics", {
        params: queryParams,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.response);
        return { error: true, message: err.message };
      })
      .finally(() => setExecuting(false));

    setResponse(statistics);
  };

  return (
    <>
      <Head>
        <title>{`API Docs - ${shortTitle}`}</title>
      </Head>
      <APIUrl title="copy API url">
        API Url:{" "}
        <span onClick={copy(API_URL)}>
          {API_URL} <AiOutlineCopy />
        </span>
      </APIUrl>
      <Container>
        <Column>
          <Endpoint>
            <div>GET</div>
            <span>/statistics</span>
          </Endpoint>
          <QueryParams>
            <h3>Query params</h3>
            <span>
              Query params let you customize the data you get from the API.
              <br />
              Empty query params will give you all statistics available.
            </span>
            <Blue>
              Query string based on the params below,
              <br />
              it's already injected in the example request.
            </Blue>
            <QueryStringCopyContainer>
              <QueryString>{getURLSearchParams(queryParams)}</QueryString>
              <button onClick={copy(getURLSearchParams(queryParams))} title="copy">
                <AiOutlineCopy />
              </button>
            </QueryStringCopyContainer>
            <QueryParam>
              <QueryParamName>positions</QueryParamName>
              <QueryParamDescription>
                <div>(optional - can be empty)</div>
                <br />
                Comma separated list of positions to search for
              </QueryParamDescription>
              <QueryParamInput
                value={queryParams.positions}
                onChange={onChangeWrapper(setPositions)}
              />
            </QueryParam>
            <QueryParam>
              <QueryParamName>start_date</QueryParamName>
              <QueryParamDescription>
                <div>must me in format - dd/mm/yyyy</div>
                <div>(optional - can be empty)</div>
                <br />
                Start date of the period to search for (dd/mm/yyyy)
              </QueryParamDescription>
              <QueryParamInput
                value={queryParams.start_date}
                onChange={onChangeWrapper(setStartDate)}
              />
            </QueryParam>
            <QueryParam>
              <QueryParamName>end_date</QueryParamName>
              <QueryParamDescription>
                <div>must me in format - dd/mm/yyyy</div>
                <div>(optional - can be empty)</div>
                <br />
                End date of the period to search for (dd/mm/yyyy)
              </QueryParamDescription>
              <QueryParamInput
                value={queryParams.end_date}
                onChange={onChangeWrapper(setEndDate)}
              />
            </QueryParam>
            <QueryParam>
              <QueryParamName>count_threshold</QueryParamName>
              <QueryParamDescription>
                <div>(optional - can be empty)</div>
                <br />
                Minimum number of job postings to be included in the results
              </QueryParamDescription>
              <QueryParamInput
                value={queryParams.count_threshold}
                onChange={onChangeWrapper(setCountThreshold)}
              />
            </QueryParam>
          </QueryParams>
        </Column>
        <Column>
          <h3>Example request</h3>
          <ActualQuery>
            <ReqType>GET</ReqType>
            <APIUrlPart>{API_URL}statistics</APIUrlPart>
            <APIUrlParams>{getURLSearchParams(queryParams)}</APIUrlParams>
            <br />
            <ExecuteRequest>
              <button onClick={executing ? undefined : executeRequest}>
                {executing ? "Executing..." : "Execute request"}
              </button>
            </ExecuteRequest>
            <div style={{ height: "1px", background: "#fff", margin: "1rem 0" }} />
            {response ? (
              <div>
                <h3>Response:</h3>
                <SyntaxHighlighter
                  language="json"
                  style={atelierDuneDark}
                  customStyle={{
                    borderRadius: "16px",
                    fontSize: "1rem",
                    maxHeight: "25vh",
                    overflowY: "auto",
                  }}
                >
                  {JSON.stringify(response, null, 2)}
                </SyntaxHighlighter>
                <div style={{ height: "1px", background: "#fff", margin: "1rem 0" }} />
              </div>
            ) : null}
            <ResponseProperties>
              <h3>Response properties:</h3>
              <QueryParam>
                <QueryParamName>generation_queued</QueryParamName>
                <QueryParamDescription>
                  <div>true or false</div>
                  <br />
                  Whether the request was queued for generation or not, if it was not queued it
                  means the data was already generated and cached within last 24 hours.
                </QueryParamDescription>
              </QueryParam>
              <QueryParam>
                <QueryParamName>statistics</QueryParamName>
                <QueryParamDescription>
                  <div>null or PositionStatistics</div>
                  <br />
                  If its null it means the request was queued for generation and the statistics will
                  be available soon, if its not null it means the statistics are available, if the
                  statistics are there and the generation_queued is true it means the statistics
                  were generated some time ago and need to be regenerated. If the statistics are
                  null and the generation_queued is false it means the request was not queued for
                  generation and something went wrong or the statistics are not available.
                </QueryParamDescription>
              </QueryParam>
              <QueryParam>
                <QueryParamName>PositionStatistics</QueryParamName>
                <QueryParamDescription style={{ whiteSpace: "pre-wrap" }}>
                  <div>TypeScript interfaces representing the data</div>
                  <SyntaxHighlighter
                    language="typescript"
                    style={atelierDuneDark}
                    customStyle={{ borderRadius: "16px" }}
                  >
                    {POSITION_STATISTICS_TYPES}
                  </SyntaxHighlighter>
                </QueryParamDescription>
              </QueryParam>
            </ResponseProperties>
          </ActualQuery>
        </Column>
      </Container>
    </>
  );
}

const ResponseProperties = styled.div`
  margin-top: 16px;
`;

const ReqType = styled.span`
  user-select: none;

  width: min-content;
  background-color: #00c8f8;
  color: #000;

  border-radius: 4px;
  padding: 4px 8px;
  padding-bottom: 0;

  margin-right: 8px;
`;

const APIUrlPart = styled.span`
  color: #00c8f8;
`;

const APIUrlParams = styled.span`
  word-break: break-all;
`;

const ExecuteRequest = styled.div`
  display: flex;
  justify-content: flex-end;

  > button {
    margin-top: 16px;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    background-color: #00c8f8;
    color: #000;
    font-size: 1.2rem;
    cursor: pointer;
    font-weight: 600;

    transition: 0.2s;

    :hover {
      background-color: #00c8f880;
    }

    :active {
      background-color: #00c8f8;
    }
  }
`;

const ActualQuery = styled.div`
  font-size: 1.2rem;
  background-color: #00c8f830;
  border-radius: 8px;
  padding: 16px;

  max-height: 75vh;
  overflow-y: auto;

  margin-bottom: 16px;
`;

const QueryParam = styled.div`
  margin-top: 16px;
`;

const QueryParamName = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  color: #00c8f8;
`;

const QueryParamDescription = styled.div`
  font-size: 0.9rem;
  margin-top: 4px;

  > div {
    color: #00c8f880;
    margin-top: -4px;
    margin-bottom: -4px;
  }
`;

const QueryParamInput = styled.input`
  width: 100%;
  max-width: 400px;
  height: 2rem;
  box-sizing: border-box;
  border: 1px solid #00c8f890;
  border-radius: 8px;
  padding: 0px 8px;
  margin-top: 4px;
  font-size: 1rem;
  background: transparent;
  color: white;

  :focus {
    outline: none;
    border: 1px solid #00c8f8;
  }

  ::placeholder {
    color: #00c8f890;
  }
`;

const QueryStringCopyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: min-content;
  max-width: 100%;

  > button {
    height: 2rem;
    width: 3rem;
    border-radius: 0px 8px 8px 0px;
    border: 0px;
    border-left: none;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #00c8f890;
    color: #000;

    cursor: pointer;

    transition: background-color 0.2s ease-in-out;

    :hover {
      background-color: #00c8f8;
    }
    :active {
      background-color: #00c8f890;
    }

    > svg {
      margin: 0px 8px;
      height: 1.5rem;
      width: 1.5rem;
    }
  }
`;

const QueryString = styled.div`
  height: 2rem;
  box-sizing: border-box;

  border: 1px solid #00c8f890;
  border-radius: 8px 0px 0px 8px;
  padding: 8px;
  padding-bottom: 4px;

  max-width: calc(400px - 3rem);
  white-space: nowrap;

  overflow-x: auto;

  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Blue = styled.span`
  color: #00c8f890;
`;

const QueryParams = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  > h3 {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }

  > span {
    margin-bottom: 8px;
  }
`;

const Endpoint = styled.h2`
  margin-top: 0px;
  margin-bottom: 16px;

  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 2.5rem;

  > div {
    background-color: #00c8f8;
    color: #000;

    border-radius: 4px;
    padding: 4px 8px;
    padding-bottom: 0;
  }

  > span {
    margin-bottom: -4px;
  }
`;

const APIUrl = styled.h1`
  margin-top: 32px;
  margin-left: 24px;

  font-size: 2.5rem;
  color: #00c8f8;

  @media (max-width: 600px) {
    margin-left: 16px;
  }

  > span {
    font-size: 2.25rem;

    @media (max-width: 600px) {
      font-size: 1.8rem;
    }

    color: white;
    cursor: pointer;
    transition: color 0.2s ease-in-out;

    &:hover {
      text-decoration: underline;
    }

    > svg {
      margin-bottom: -0.1em;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 16px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 0 8px;
    gap: 8px;
  }
`;

const Column = styled.div`
  flex-basis: calc(50% - 8px);
  box-sizing: border-box;
  padding: 0 10px;
  width: calc(50% - 8px);

  @media (max-width: 600px) {
    flex-basis: 100%;
    width: 100%;
  }

  > h3 {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
`;

const POSITION_STATISTICS_TYPES = `
  interface PositionStatistics {
    statId: string;
    positions: string[];
    startDate: string | null;
    endDate: string | null;
    techStatistics: TechStatistics[];
    totalJobsCount: number;
    timestamp: number;
  }

  interface TechStatistics {
    tech: string;
    popularity: number;
    count: number;
    location_statistics: LocationStatistics;
    type_statistics: TypeStatistics;
    salary_statistics: SalaryStatistics;
    popularity_statistics: PopularityStatistics[];
  }

  interface LocationStatistics {
    remote: number;
    office: number;
    hybrid: number;
  }

  interface SalaryStatistics {
    all: number[];
    max: number;
    upper_quartile: number;
    median: number;
    lower_quartile: number;
    min: number;
  }

  interface TypeStatistics {
    full_time: number;
    part_time: number;
    freelance: number;
  }

  interface PopularityStatistics {
    date: string;
    popularity: number;
    count: number;
  }
`;
