import React from "react";
import Header from "./components/Header";
import ThemeSwitch from "./components/ThemeSwitch";

// Education Component
const Education = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold">Education</h2>
    <p className="mt-2 text-lg">
      University of Pittsburgh — B.S. in Computer Science & B.S. in Psychology (2020 - Present)
    </p>
    <p className="text-lg">GPA: 3.9</p>
  </div>
);

// Experience Component
const Experience = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold">Experience</h2>
    <div className="mt-4">
      <h3 className="text-xl font-medium">Software Development Intern @ TherapyNotes LLC</h3>
      <p className="italic">May 2022 - Present</p>
      <ul className="list-disc pl-8">
        <li>
          Built client-facing features for an industry-leading behavioral health EHR system using
          .NET framework, C#, and TypeScript.
        </li>
        <li>Assisted in MVC site architecture development.</li>
        <li>Collaborated across teams with Agile practices.</li>
      </ul>
    </div>
  </div>
);

// Projects Component
const Projects = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold">Projects</h2>
    <div className="mt-4">
      <h3 className="text-xl font-medium">University of Pittsburgh Website Theme Manager</h3>
      <p className="text-lg">
        Chromium browser-based extension for CSS injection with customizable options.
      </p>
      <h3 className="text-xl font-medium mt-4">2D Unity Puzzle Game</h3>
      <p className="text-lg">
        Side-scrolling game built with Unity using C#, featuring collision physics and score
        tracking.
      </p>
    </div>
  </div>
);

// Skills Component
const Skills = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold">Skills</h2>
    <p className="text-lg">Proficient in: Java, C#, HTML/CSS</p>
    <p className="text-lg">Can work with: Python, C++, JavaScript</p>
  </div>
);

// App Component
const App = () => {
  return (
    <div>
      <Header />
      <ThemeSwitch />
      <Education />
      <Experience />
      <Projects />
      <Skills />
    </div>
  );
};

export default App;
