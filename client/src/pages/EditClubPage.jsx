import { Link as RouterLink } from "react-router-dom";
import { Box, Heading, Button, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const MyClub = () => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    // Load the joined clubs from local storage
    const savedClubs = JSON.parse(localStorage.getItem("joinedClubs")) || [];
    setClubs(savedClubs);
  }, []);

  return (
    <Box p={8}>
      <Heading as="h1" mb={8}>
        My Clubs
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {clubs.length > 0 ? (
          clubs.map((club) => (
            <Box key={club.id} p={5} borderWidth="1px" borderRadius="lg">
              <Heading as="h3" size="md" mb={4}>
                {club.name}
              </Heading>
              <Button
                as={RouterLink}
                to={`/club/${club.id}`}
                colorScheme="orange"
              >
                View Club
              </Button>
            </Box>
          ))
        ) : (
          <Box>
            <Heading as="h3" size="lg">
              You have not joined any clubs yet.
            </Heading>
          </Box>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default MyClub;
