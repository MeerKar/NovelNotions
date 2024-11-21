// src/components/Footer/index.jsx

import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Text,
  IconButton,
  Link,
  Stack,
  useColorModeValue,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowLeft } from "react-icons/fa";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define color schemes based on the current color mode
  const bgGradient = useColorModeValue(
    "linear(to-r, #D1E8E2, #A3D9D5)", // Light mode gradient
    "linear(to-r, #A3D9D5, #D1E8E2)" // Dark mode gradient (reversed for subtle variation)
  );
  const textColor = useColorModeValue("gray.800", "gray.200");
  const buttonHoverBg = useColorModeValue("#AED9D1", "#AED9D1"); // Consistent hover color
  const iconHoverBg = useColorModeValue("gray.600", "gray.700");

  return (
    <Box as="footer" w="100%" bgGradient={bgGradient} p={8} color={textColor}>
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        maxW="1200px"
        mx="auto"
      >
        {/* Optional "Go Back" Button */}
        {location.pathname !== "/" && (
          <Tooltip label="Go Back" aria-label="Go Back Tooltip">
            <Button
              leftIcon={<FaArrowLeft />}
              colorScheme="green"
              variant="solid"
              mb={{ base: 4, md: 0 }}
              onClick={() => navigate(-1)}
              _hover={{ bg: buttonHoverBg }}
            >
              Go Back
            </Button>
          </Tooltip>
        )}

        {/* Social Media Links */}
        <VStack spacing={4}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={useColorModeValue("gray.700", "gray.300")}
          >
            Connect with Us
          </Text>
          <Stack direction="row" spacing={6}>
            <Tooltip label="Follow us on GitHub" aria-label="GitHub Tooltip">
              <Link href="https://github.com/your-profile" isExternal>
                <IconButton
                  aria-label="GitHub"
                  icon={<FaGithub />}
                  colorScheme="gray"
                  variant="ghost"
                  size="lg"
                  _hover={{ bg: iconHoverBg }}
                />
              </Link>
            </Tooltip>
            <Tooltip label="Connect on LinkedIn" aria-label="LinkedIn Tooltip">
              <Link
                href="https://www.linkedin.com/in/meera-g-karnavar-29ab3010/"
                isExternal
              >
                <IconButton
                  aria-label="LinkedIn"
                  icon={<FaLinkedin />}
                  colorScheme="blue"
                  variant="ghost"
                  size="lg"
                  _hover={{ bg: iconHoverBg }}
                />
              </Link>
            </Tooltip>
            <Tooltip label="Send us an Email" aria-label="Email Tooltip">
              <Link href="mailto:your-email@example.com" isExternal>
                <IconButton
                  aria-label="Email"
                  icon={<FaEnvelope />}
                  colorScheme="red"
                  variant="ghost"
                  size="lg"
                  _hover={{ bg: iconHoverBg }}
                />
              </Link>
            </Tooltip>
          </Stack>
        </VStack>
      </Flex>

      {/* Divider */}
      <Box borderBottom="1px" borderColor="gray.400" my={8} />

      {/* Footer Bottom Section */}
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        maxW="1200px"
        mx="auto"
      >
        <Text
          mb={{ base: 2, md: 0 }}
          fontSize="sm"
          color={useColorModeValue("gray.700", "gray.300")}
        >
          &copy; {new Date().getFullYear()} NovelNotions. All rights reserved.
        </Text>
        <VStack spacing={1} textAlign="center" maxW="600px" mx="auto">
          <Text
            fontSize="sm"
            color={useColorModeValue("gray.700", "gray.300")}
            fontStyle="italic"
          >
            The only thing you absolutely have to know is the location of the
            library.
          </Text>
          <Text
            fontSize="sm"
            color={useColorModeValue("gray.700", "gray.300")}
            fontStyle="italic"
          >
            — Albert Einstein
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Footer;
