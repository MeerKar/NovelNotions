// src/pages/MyReads.jsx

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Container,
  SimpleGrid,
  useColorModeValue,
  Text,
  Button,
  Spinner,
  Icon,
  Stack,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBook,
  FaTrash,
  FaSort,
  FaFilter,
  FaExclamationTriangle,
} from "react-icons/fa";
import BookCard from "../components/BookCard";
import AuthService from "../utils/Auth";

const MotionBox = motion(Box);

const MyReads = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("title");
  const [filterBy, setFilterBy] = useState("all");
  const navigate = useNavigate();
  const toast = useToast();

  // Get the current user
  const currentUser = AuthService.loggedIn() ? AuthService.getProfile() : null;
  const userId = currentUser?.id;

  // Color modes
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    const fetchBooks = async () => {
      if (!userId) return;

      try {
        setError(null);
        const savedBooksKey = `savedBooks_${userId}`;
        const savedBooks =
          JSON.parse(localStorage.getItem(savedBooksKey)) || [];

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
          category: book.category || "Uncategorized",
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
  }, [userId]);

  const handleRemoveBook = (bookId) => {
    const updatedBooks = books.filter((book) => book.bookId !== bookId);
    setBooks(updatedBooks);
    localStorage.setItem(`savedBooks_${userId}`, JSON.stringify(updatedBooks));
    toast({
      title: "Book removed",
      description: "The book has been removed from your reading list.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    const sortedBooks = [...books].sort((a, b) => {
      switch (sortType) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "rank":
          return (b.rank || 0) - (a.rank || 0);
        default:
          return 0;
      }
    });
    setBooks(sortedBooks);
  };

  const handleFilter = (filterType) => {
    setFilterBy(filterType);
    const savedBooksKey = `savedBooks_${userId}`;
    const allBooks = JSON.parse(localStorage.getItem(savedBooksKey)) || [];
    const filteredBooks =
      filterType === "all"
        ? allBooks
        : allBooks.filter((book) => book.category === filterType);
    setBooks(filteredBooks);
  };

  if (!currentUser) {
    return (
      <Container maxW="container.md" py={10}>
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Please Log In
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            You need to be logged in to view your reading list.
          </AlertDescription>
          <Button mt={4} colorScheme="teal" onClick={() => navigate("/login")}>
            Log In
          </Button>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        bg={bgColor}
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
      <Container maxW="container.md" py={10}>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Error Loading Books
          </AlertTitle>
          <AlertDescription maxWidth="sm">{error}</AlertDescription>
          <Button
            mt={4}
            colorScheme="teal"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stack spacing={8}>
            <Flex justify="space-between" align="center">
              <Heading as="h1" size="2xl" color={headingColor}>
                My Reading List
              </Heading>
              <ButtonGroup spacing={4}>
                <Menu>
                  <MenuButton
                    as={Button}
                    leftIcon={<FaSort />}
                    colorScheme="teal"
                    variant="outline"
                  >
                    Sort By
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => handleSort("title")}>
                      Title
                    </MenuItem>
                    <MenuItem onClick={() => handleSort("author")}>
                      Author
                    </MenuItem>
                    <MenuItem onClick={() => handleSort("rank")}>Rank</MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton
                    as={Button}
                    leftIcon={<FaFilter />}
                    colorScheme="teal"
                    variant="outline"
                  >
                    Filter By
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => handleFilter("all")}>
                      All Books
                    </MenuItem>
                    <MenuItem onClick={() => handleFilter("Fiction")}>
                      Fiction
                    </MenuItem>
                    <MenuItem onClick={() => handleFilter("Nonfiction")}>
                      Nonfiction
                    </MenuItem>
                    <MenuItem onClick={() => handleFilter("Biography")}>
                      Biography
                    </MenuItem>
                  </MenuList>
                </Menu>
              </ButtonGroup>
            </Flex>

            {books.length > 0 ? (
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                spacing={6}
              >
                {books.map((book) => (
                  <MotionBox
                    key={book.bookId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box position="relative">
                      <BookCard {...book} />
                      <IconButton
                        aria-label="Remove book"
                        icon={<FaTrash />}
                        colorScheme="red"
                        size="sm"
                        position="absolute"
                        top={2}
                        right={2}
                        onClick={() => handleRemoveBook(book.bookId)}
                        opacity={0}
                        _hover={{ opacity: 1 }}
                        transition="opacity 0.2s"
                      />
                    </Box>
                  </MotionBox>
                ))}
              </SimpleGrid>
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                w="100%"
                py={20}
                bg={cardBg}
                borderRadius="lg"
              >
                <Icon as={FaBook} boxSize={16} color="gray.400" mb={4} />
                <Text fontSize="xl" color={textColor} mb={4}>
                  Your reading list is empty
                </Text>
                <Text color={textColor} mb={6}>
                  Start adding books to your collection
                </Text>
                <Button
                  as={Link}
                  to="/books"
                  colorScheme="teal"
                  size="lg"
                  leftIcon={<FaBook />}
                >
                  Browse Books
                </Button>
              </Flex>
            )}
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default MyReads;
