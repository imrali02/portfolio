import React, { useState } from "react";

const ThemeSwitch: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You can add logic here to update the theme in your application
  };

  return (
    <div>
      <label htmlFor="themeSwitch">Dark Mode</label>
      <input type="checkbox" id="themeSwitch" checked={isDarkMode} onChange={toggleTheme} />
    </div>
  );
};

export default ThemeSwitch;
