// src/pages/MyReads.jsx

import { useEffect, useState } from "react";
import {
  
  Flex,
  Heading,
  Container,
  SimpleGrid,
  useColorModeValue,
  Text,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import AuthService from "../utils/Auth";
// import { fetchBestSellers } from "../components/API"; // Reuse the same function as in SingleBook to ensure consistency

const MyReads = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the current user
  const currentUser = AuthService.loggedIn() ? AuthService.getProfile() : null;

  useEffect(() => {
    const fetchBooks = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        // Fetch saved books from local storage
        const savedBooksKey = `savedBooks_${currentUser.id}`;
        const savedBooks = JSON.parse(localStorage.getItem(savedBooksKey)) || [];

        // Normalize savedBooks to have a consistent structure with the SingleBook page
        const normalizedSavedBooks = savedBooks.map((book) => ({
          bookId: book.primary_isbn10 || book._id,
          title: book.title || "Unknown Title",
          author: book.author || "Unknown Author",
          book_image: book.book_image || "default_image_url_here",
          description: book.description || "No description available.",
          publisher: book.publisher || "Unknown Publisher",
          rank: book.rank || null,
          rank_last_week: book.rank_last_week || null,
          weeks_on_list: book.weeks_on_list || null,
        }));

        setBooks(normalizedSavedBooks);
      } catch (error) {
        console.error("Failed to fetch saved books:", error);
        setError(error.message || "Failed to fetch saved books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentUser]);

  // Define color schemes based on the current color mode
  const headingColor = useColorModeValue("gray.800", "white");
  const spinnerBgColor = useColorModeValue("#A9D6E5", "#F0EFEB");

  if (!currentUser) {
    return (
      <Flex justify="center" align="center" w="100%" minH="50vh">
        <Text fontSize="xl" color="gray.500">
          Please log in to view your reads.
        </Text>
      </Flex>
    );
  }

  if (loading) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        bg={spinnerBgColor}
      >
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.500"
        />
        <Text mt={4} fontSize="lg" color="teal.500">
          Loading your saved books...
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" w="100%" minH="50vh">
        <Text fontSize="xl" color="red.500">
          {error}
        </Text>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h2" size="lg" color={headingColor} mb={8}>
        My Reads
      </Heading>

      {books.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {books.map((book) => (
            <BookCard key={book.bookId} {...book} />
          ))}
        </SimpleGrid>
      ) : (
        <Flex direction="column" justify="center" align="center" w="100%">
          <Text fontSize="xl" color="gray.500" mb={4}>
            You have not saved any books yet.
          </Text>
          <Button as={Link} to="/books" colorScheme="teal">
            Browse Books
          </Button>
        </Flex>
      )}
    </Container>
  );
};

export default MyReads;
