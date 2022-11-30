import styled from "styled-components";
// import backgroundImage from "../../assets/source.png";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("./source.png");
`;

export const Panel = styled.div`
  position: absolute;
  width: 300px;
  height: 60px;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, 0);
`;
