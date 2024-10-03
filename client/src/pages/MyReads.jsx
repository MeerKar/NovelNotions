import { useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  SimpleGrid,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { Link as RouterLink } from "react-router-dom";
import Auth from "../utils/auth";

const MyReads = () => {
  const { loading, data, refetch } = useQuery(QUERY_ME, {
    skip: !Auth.loggedIn(), // Skip query if the user is not authenticated
  });

  // Refetch the data whenever the component mounts
  useEffect(() => {
    if (Auth.loggedIn()) {
      refetch();
    }
  }, [refetch]);

  const books = data?.me?.books || [];

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box bg="#f8ede3" p={8}>
      <Heading as="h1" mb={8} textAlign="center">
        My Reads
      </Heading>

      {books.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {books.map((book) => (
            <Box
              key={book._id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <Image
                src={book.book_image || "https://via.placeholder.com/150"}
                alt={book.title || "No Image Available"}
              />
              <Box p={6}>
                <Heading as="h3" size="lg" mb={2}>
                  {book.title}
                </Heading>
                <Text fontWeight="bold" color="gray.600" mb={2}>
                  {book.author}
                </Text>
                <Text noOfLines={3} mb={4}>
                  {book.description}
                </Text>
                {book.primary_isbn10 && (
                  <Button
                    as={RouterLink}
                    to={`/books/${book.primary_isbn10}`}
                    colorScheme="orange"
                  >
                    View Details
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Flex justify="center" align="center" direction="column" minH="50vh">
          <Text fontSize="xl" color="blackAlpha.500" mb={4}>
            Your reads are empty.
          </Text>
          <Button as={RouterLink} to="/books" colorScheme="orange">
            Add Books
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default MyReads;
