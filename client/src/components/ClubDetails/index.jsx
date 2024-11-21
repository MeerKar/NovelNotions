// src/components/Clubs/ClubDetails.jsx

import {
  Box,
  Heading,
  Text,
  Tag,
  Image,
  Flex,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const ClubDetails = ({ club }) => {
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Flex direction={{ base: "column", md: "row" }} align="center">
      <Image
        src={club.image}
        alt={`${club.name} Image`}
        boxSize={{ base: "200px", md: "300px" }}
        objectFit="cover"
        borderRadius="md"
        boxShadow="md"
        mr={{ md: 6 }}
        mb={{ base: 4, md: 0 }}
      />
      <Box>
        <Heading as="h1" size="2xl" color={headingColor}>
          {club.name}
        </Heading>
        <Text color={textColor} mt={2}>
          {club.description}
        </Text>
        {club.category && (
          <Tag colorScheme="teal" mt={2}>
            {club.category}
          </Tag>
        )}
        <Button
          as={RouterLink}
          to="/join-club" // Adjust the route as needed
          colorScheme="orange"
          mt={4}
        >
          Join Club
        </Button>
      </Box>
    </Flex>
  );
};

export default ClubDetails;
