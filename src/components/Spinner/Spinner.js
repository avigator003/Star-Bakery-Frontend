import React from "react";
import { Dna } from "react-loader-spinner";
import styled from "styled-components";

function Spinner() {
  return (
    <LoaderContainer data-testid="spinner">
      <Dna
        visible
        height={100}
        width={100}
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </LoaderContainer>
  );
}

export const LoaderContainer = styled.div`
  text-align: center;
`;
export default Spinner;
