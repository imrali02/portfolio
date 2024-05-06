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
    <header className="bg-gray-800 text-white text-center p-6">
      <h1 className="text-3xl font-bold">Imran Haidery</h1>
      <p className="text-lg mt-2">
        Email:{" "}
        <a href="mailto:iahaidery@gmail.com" className="text-blue-400 hover:text-blue-300">
          iahaidery@gmail.com
        </a>
      </p>
      <p className="text-lg">
        Github:{" "}
        <a
          href="https://github.com/imrali02"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          imrali02
        </a>
      </p>
    </header>
  </HeaderContainer>
);

export default Header;
