import { useState } from "react";
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
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import ClubCard from "../components/ClubCard";

const JoinClubPage = () => {
  const { loading, error, data } = useQuery(QUERY_CLUBS, {
    fetchPolicy: "cache-and-network", // Ensures fresh data without refetching too aggressively
  });

  const [searchTerm, setSearchTerm] = useState([]);
  const headingColor = useColorModeValue("teal.600", "teal.300");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClubs = data?.clubs?.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="2xl" mb={6} color={headingColor}>
        Join a Club
      </Heading>

      <Flex justify="center" mb={6}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search for a club"
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </Flex>

      {filteredClubs && filteredClubs.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {filteredClubs.map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </SimpleGrid>
      ) : (
        <Text textAlign="center">No clubs match your search criteria.</Text>
      )}
    </Container>
  );
};

export default JoinClubPage;
