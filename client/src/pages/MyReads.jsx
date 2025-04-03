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
  VStack,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorMode,
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
import Auth from "../utils/auth";

const MotionBox = motion(Box);

const MyReads = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("title");
  const [filterBy, setFilterBy] = useState("all");
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "gray.50" : "gray.900";
  const cardBg = colorMode === "light" ? "white" : "gray.800";
  const textColor = colorMode === "light" ? "gray.800" : "gray.100";

  // Get the current user
  const currentUser = Auth.loggedIn() ? Auth.getProfile() : null;
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchSavedBooks = () => {
      try {
        if (!Auth.loggedIn()) {
          setError("Please log in to view your saved books.");
          setLoading(false);
          return;
        }

        const savedBooksKey = `savedBooks_${userId}`;
        const savedBooks =
          JSON.parse(localStorage.getItem(savedBooksKey)) || [];
        setBooks(savedBooks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching saved books:", err);
        setError("Failed to fetch saved books. Please try again later.");
        setLoading(false);
      }
    };

    fetchSavedBooks();
  }, [userId]);

  const handleRemoveBook = (bookId) => {
    try {
      const updatedBooks = books.filter((book) => book.bookId !== bookId);
      localStorage.setItem(
        `savedBooks_${userId}`,
        JSON.stringify(updatedBooks)
      );
      setBooks(updatedBooks);

      toast({
        title: "Book removed",
        description: "The book has been removed from your reading list.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error removing book:", err);
      toast({
        title: "Error",
        description: "Failed to remove the book. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading color={textColor}>My Reading List</Heading>
          <ButtonGroup>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FaSort />}
                variant="outline"
                colorScheme="teal"
              >
                Sort By
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleSort("title")}>Title</MenuItem>
                <MenuItem onClick={() => handleSort("author")}>Author</MenuItem>
                <MenuItem onClick={() => handleSort("rank")}>Rank</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FaFilter />}
                variant="outline"
                colorScheme="teal"
              >
                Filter By
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleFilter("all")}>All</MenuItem>
                <MenuItem onClick={() => handleFilter("fiction")}>
                  Fiction
                </MenuItem>
                <MenuItem onClick={() => handleFilter("nonfiction")}>
                  Non-Fiction
                </MenuItem>
              </MenuList>
            </Menu>
          </ButtonGroup>
        </Flex>

        {books.length === 0 ? (
          <Box
            bg={cardBg}
            p={8}
            borderRadius="lg"
            textAlign="center"
            boxShadow="sm"
          >
            <Icon as={FaBook} boxSize={12} color="gray.500" mb={4} />
            <Text fontSize="xl" color="gray.500">
              Your reading list is empty.
            </Text>
            <Button mt={4} colorScheme="teal" onClick={() => navigate("/")}>
              Discover Books
            </Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {books.map((book) => (
              <Box
                key={book.bookId}
                bg={cardBg}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="sm"
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "md",
                }}
              >
                <Box position="relative" height="300px">
                  <Image
                    src={
                      book.book_image ||
                      "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={book.title}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                </Box>

                <Box p={6}>
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color={textColor}>
                      {book.title}
                    </Heading>
                    <Text color="gray.500" fontSize="md">
                      by {book.author}
                    </Text>

                    {book.rank && (
                      <Badge colorScheme="teal" alignSelf="start">
                        Rank #{book.rank}
                      </Badge>
                    )}

                    <Accordion allowToggle>
                      <AccordionItem border="none">
                        <AccordionButton px={0}>
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="bold">
                              Reviews ({(book.reviews || []).length})
                            </Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4} px={0}>
                          {book.reviews && book.reviews.length > 0 ? (
                            <VStack spacing={3} align="stretch">
                              {book.reviews.map((review, index) => (
                                <Box
                                  key={index}
                                  p={3}
                                  bg={
                                    colorMode === "light"
                                      ? "gray.50"
                                      : "gray.700"
                                  }
                                  borderRadius="md"
                                >
                                  <Text fontWeight="bold" fontSize="sm">
                                    {review.username}
                                  </Text>
                                  <Text color="gray.500" fontSize="xs">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString()}
                                  </Text>
                                  <Text mt={2} fontSize="sm">
                                    {review.reviewText}
                                  </Text>
                                </Box>
                              ))}
                            </VStack>
                          ) : (
                            <Text color="gray.500" fontSize="sm">
                              No reviews yet
                            </Text>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>

                    <Stack direction="row" spacing={4} mt={2}>
                      <Button
                        flex={1}
                        colorScheme="teal"
                        onClick={() => navigate(`/books/${book.bookId}`)}
                      >
                        View Details
                      </Button>
                      <IconButton
                        aria-label="Remove book"
                        icon={<FaTrash />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveBook(book.bookId)}
                      />
                    </Stack>
                  </VStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default MyReads;
