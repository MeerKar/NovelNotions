import React from "react";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import Footer from "../components/Footer";
import { Box } from "@chakra-ui/react";

const Home = () => {
  return (
    <Box>
      <HeroSection />
      <FeatureSection />
    </Box>
  );
};

export default Home;
