import styled from "@emotion/styled";
import { useRouter } from "next/router";

export default function DateRange() {
  const router = useRouter();
  const {
    query: { start_date, end_date },
  } = router;

  return <div></div>;
}
