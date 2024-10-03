import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Spinner,
  SimpleGrid,
  Image,
  Text,
  Heading,
  Container,
  Button,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { QUERY_BOOKS } from "../utils/queries"; // Adjust the query to fetch the bookshelf

const Books = () => {
  const { loading, data, error } = useQuery(QUERY_BOOKS);

  if (loading) return <Spinner />;
  if (error) return <Text>Error loading books.</Text>;

  const books = data?.books || [];

  return (
    <Container maxW="container.lg">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {books.map((book) => (
          <Box
            key={book._id} // Use _id as key if it's coming from MongoDB
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Image src={book.image} alt={book.title} />
            <Box p={6}>
              <Heading as="h3" size="md">
                {book.title}
              </Heading>
              <Text>{book.author}</Text>
              <Button
                as={RouterLink}
                to={`/books/${book._id}`} // Adjusted to use _id
                colorScheme="orange"
                mt={2}
              >
                View Details
              </Button>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Books;
