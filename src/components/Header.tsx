import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  background-color: #003366; // Dark blue
  color: white;
  padding: 10px 20px;
  text-align: center;
`;

const Header = () => (
  <HeaderContainer>
    <h1>Imran Haidery</h1>
    <p>Full-Stack Software Developer</p>
  </HeaderContainer>
);

export default Header;
