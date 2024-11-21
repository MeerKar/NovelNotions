// src/pages/ClubDetailPage.jsx

import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_SINGLE_CLUB } from "../utils/queries"; // Corrected import
import {
  Spinner,
  Text,
  Container,
  Button,
  Image,
  Heading,
  Stack,
  Box,
  Alert,
  AlertIcon,
  Flex,
  Tag,
  Avatar,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
// import ClubDetails from "../components/ClubDetails"; // Ensure this component exists

const ClubDetailPage = () => {
  const { clubId } = useParams();

  const { loading, error, data } = useQuery(QUERY_SINGLE_CLUB, {
    variables: { clubId },
  });

  const colorTeal = useColorModeValue("teal.600", "teal.300");
  const colorGray = useColorModeValue("gray.600", "gray.300");

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

  const club = data.club;

  if (!club) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          No club found with the provided ID.
        </Alert>
        <Button as={RouterLink} to="/clubs" colorScheme="teal" mt={4}>
          Back to Clubs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Stack spacing={6}>
        {/* Club Header */}
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
            <Heading as="h1" size="2xl" color={colorTeal}>
              {club.name}
            </Heading>
            <Text color={colorGray} mt={2}>
              {club.description}
            </Text>
            {/* Example Tag for Club Type or Category */}
            {club.category && (
              <Tag colorScheme="teal" mt={2}>
                {club.category}
              </Tag>
            )}
            {/* Join/Leave Button */}
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

        {/* Books Section */}
        <Box>
          <Heading as="h2" size="lg" mb={4} color={colorTeal}>
            Books
          </Heading>
          {club.books.length > 0 ? (
            <Stack spacing={4}>
              {club.books.map((book) => (
                <Box
                  key={book._id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="sm"
                >
                  <Heading as="h3" size="md">
                    {book.title}
                  </Heading>
                  <Text fontStyle="italic">by {book.author}</Text>
                  <Text mt={2}>{book.description}</Text>
                  <Button
                    as={RouterLink}
                    to={`/books/${book.primary_isbn10}`}
                    colorScheme="teal"
                    size="sm"
                    mt={2}
                  >
                    View Book
                  </Button>
                </Box>
              ))}
            </Stack>
          ) : (
            <Text>No books have been added to this club yet.</Text>
          )}
        </Box>

        {/* Members Section */}
        <Box>
          <Heading as="h2" size="lg" mb={4} color={colorTeal}>
            Members
          </Heading>
          {club.users.length > 0 ? (
            <Wrap spacing={4}>
              {club.users.map((user) => (
                <WrapItem key={user._id}>
                  <Flex direction="column" align="center">
                    <Avatar name={user.username} src={user.avatarUrl} />
                    <Text mt={2}>{user.username}</Text>
                  </Flex>
                </WrapItem>
              ))}
            </Wrap>
          ) : (
            <Text>No members have joined this club yet.</Text>
          )}
        </Box>

        {/* Back Button */}
        <Button
          as={RouterLink}
          to="/clubs"
          colorScheme="teal"
          alignSelf="flex-start"
        >
          Back to Clubs
        </Button>
      </Stack>
    </Container>
  );
};

export default ClubDetailPage;
