import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  Text,
  Image,
  Spinner,
  Flex,
  Container,
} from "@chakra-ui/react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_SINGLE_CLUB, QUERY_ME } from "../utils/queries";
import { ADD_USER_TO_CLUB } from "../utils/mutations";
import Auth from "../utils/auth";

const ClubPage = () => {
  const { clubId } = useParams();

  // GraphQL Query to get single club data
  const { loading, data, error } = useQuery(QUERY_SINGLE_CLUB, {
    variables: { clubId },
  });

  // Mutation to add user to a club
  const [addUserToClub] = useMutation(ADD_USER_TO_CLUB, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  // State to track if the user is already joined
  const [isJoined, setIsJoined] = useState(false);
  const club = data?.club || {};

  // Effect to check if the user is already in the club
  useEffect(() => {
    if (Auth.loggedIn()) {
      const userData = Auth.getProfile().data;
      if (club.users?.some((user) => user._id === userData._id)) {
        setIsJoined(true);
      }
    }
  }, [club]);

  // Function to handle joining a club
  const handleJoinClub = async () => {
    if (Auth.loggedIn()) {
      try {
        await addUserToClub({
          variables: {
            clubId, // Only clubId is needed because userId will be inferred from context
          },
        });
        setIsJoined(true); // Update state after successful join
      } catch (err) {
        console.error("Error joining the club:", err);
      }
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md">
        <Flex direction="column" align="center" justify="center" minH="100vh">
          <Text fontSize="xl" color="red.500">
            An error occurred: {error.message}
          </Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.md">
      <Box p={8} boxShadow="md" borderRadius="md">
        {club.image && (
          <Image src={club.image} alt={club.name} mb={4} borderRadius="md" />
        )}
        <Heading as="h2" size="xl" mb={4}>
          {club.name}
        </Heading>
        <Text fontSize="md" mb={6}>
          {club.description}
        </Text>
        {isJoined ? (
          <Button colorScheme="green" disabled>
            You are a member of this club
          </Button>
        ) : (
          <Button colorScheme="orange" onClick={handleJoinClub}>
            Join Club
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default ClubPage;
