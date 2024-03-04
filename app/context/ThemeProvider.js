"use client";
import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import generateMuiTheme from "../../mui/theme";
//import "../../styles/mui.css";

// create context provider
const ThemeProviderContext = ({ children }) => {
  return <ThemeProvider theme={generateMuiTheme()}>{children}</ThemeProvider>;
};
export default ThemeProviderContext;
