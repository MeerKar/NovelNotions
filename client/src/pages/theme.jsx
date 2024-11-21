// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#f5f7ff",
      100: "#e1e8ff",
      200: "#c3d0ff",
      300: "#a4b8ff",
      400: "#86a0ff",
      500: "#6688ff",
      600: "#4c6cd4",
      700: "#3b4fa8",
      800: "#2a3380",
      900: "#1c1f56",
    },
  },
  fonts: {
    heading: "Segoe UI, sans-serif",
    body: "Roboto, sans-serif",
  },
});

export default theme;
