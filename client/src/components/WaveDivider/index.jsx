// src/components/WaveDivider.jsx

import { Box, useColorModeValue } from "@chakra-ui/react";

const WaveDivider = () => {
  // Use the hook at the top level
  const waveColor = useColorModeValue("#FFFFFF", "#1A202C");

  return (
    <Box mt={10} w="100%" h="100px" overflow="hidden">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        role="img"
        aria-label="Decorative wave divider"
      >
        <path
          d="M0,0 V46.29 C480,150, 720,0, 1200,46.29 V0 Z"
          fill={waveColor}
        ></path>
      </svg>
    </Box>
  );
};

export default WaveDivider;
