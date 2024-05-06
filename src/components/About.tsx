import React from "react";
import styled from "styled-components";

const AboutContainer = styled.section`
  padding: 20px;
  background-color: white;
  color: black;
`;

const About = () => (
  <AboutContainer>
    <h2>About Me</h2>
    <p>Professional summary and a brief introduction.</p>
  </AboutContainer>
);

export default About;
