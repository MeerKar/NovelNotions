// src/pages/ClubsListPage.jsx

import { useQuery } from "@apollo/client";
import { QUERY_CLUBS } from "../utils/queries";
import {
  Spinner,
  Text,
  Container,
  SimpleGrid,
  Heading,
  Alert,
  AlertIcon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import ClubCard from "../components/Clubs/ClubCard";

const ClubsListPage = () => {
  const { loading, error, data } = useQuery(QUERY_CLUBS);
  const headingColor = useColorModeValue("teal.600", "teal.300");

  if (loading)
    return (
      <Flex justify="center" align="center" minH="80vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );

  if (error)
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error.message}
        </Alert>
      </Container>
    );

  const clubs = data.clubs;

  return (
    <Container maxW="container.xl" py={8}>
      <Heading
        as="h1"
        size="2xl"
        mb={6}
        color={headingColor}
        // color={useColorModeValue("teal.600", "teal.300")}
      >
        All Clubs
      </Heading>
      {clubs.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {clubs.map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </SimpleGrid>
      ) : (
        <Text textAlign="center">No clubs available at the moment.</Text>
      )}
    </Container>
  );
};

export default ClubsListPage;
