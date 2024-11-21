// src/components/HeroSection/index.jsx

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Image,
  Container,
  useColorModeValue,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaArrowRight, FaBookReader } from "react-icons/fa";
import { motion } from "framer-motion";

// Define motion-enhanced components
const MotionBox = motion(Box);

const HeroSection = () => {
  // Define color schemes based on the current color mode
  const bgGradient = useColorModeValue(
    "linear(to-r, #D1E8E2, #A3D9D5)", // Light mode gradient (soft mint green)
    "linear(to-r, #2D3748, #1A202C)" // Dark mode gradient (dark slate)
  );
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const buttonBg = useColorModeValue("teal.400", "teal.600");
  const buttonHoverBg = useColorModeValue("teal.500", "teal.700");
  const overlayBg = useColorModeValue(
    "rgba(255, 255, 255, 0.6)",
    "rgba(26, 32, 44, 0.6)"
  );

  return (
    <Container maxW="container.xl" p={0}>
      <Flex
        direction={{ base: "column-reverse", md: "row" }}
        align="center"
        justify="space-between"
        bgGradient={bgGradient}
        p={{ base: 6, md: 16 }}
        borderRadius="md"
        boxShadow="lg"
        mt={8}
        overflow="hidden"
        position="relative"
      >
        {/* Decorative Overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg={overlayBg}
          zIndex="0"
          opacity={0.5}
        />

        {/* Text Content */}
        <MotionBox
          flex="1"
          p={{ base: 4, md: 8 }}
          zIndex="1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <VStack align="start" spacing={4}>
            <Heading
              as="h1"
              size="2xl"
              color={headingColor}
              lineHeight="1.2"
              fontWeight="extrabold"
              textShadow="1px 1px 2px rgba(0,0,0,0.2)"
            >
              Building Community Through Books
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={subTextColor}
              lineHeight="1.6"
              maxW="600px"
            >
              Discover, Discuss, and Delight: Uniting Readers Everywhere
            </Text>
            <Button
              as={RouterLink}
              to="/create-club"
              colorScheme="orange"
              size="lg"
              rightIcon={<FaArrowRight />}
              bg={buttonBg}
              _hover={{ bg: buttonHoverBg }}
              transition="background-color 0.3s ease"
              leftIcon={<Icon as={FaBookReader} />}
            >
              Start a Club
            </Button>
          </VStack>
        </MotionBox>

        {/* Image */}
        <MotionBox
          flex="1"
          position="relative"
          zIndex="1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Box
            position="relative"
            width={{ base: "100%", md: "auto" }}
            height={{ base: "250px", md: "400px" }}
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            _hover={{
              transform: "scale(1.05)",
              transition: "transform 0.3s ease",
            }}
          >
            <Image
              src="https://klkranes.files.wordpress.com/2018/09/book-club-discussion.jpg"
              alt="Group of people discussing books"
              objectFit="cover"
              width="100%"
              height="100%"
            />
            {/* Optional Decorative Icon */}
            <Icon
              as={FaBookReader}
              position="absolute"
              bottom="4"
              right="4"
              boxSize="40px"
              color="teal.500"
              opacity={0.8}
            />
          </Box>
        </MotionBox>
      </Flex>
    </Container>
  );
};

export default HeroSection;
