// src/pages/SingleBook.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  VStack,
  Heading,
  Container,
  Flex,
  Spinner,
  Button,
  SimpleGrid,
  Badge,
  useColorModeValue,
  useToast,
  Divider,
  Link,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FaExclamationTriangle } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import Auth from "../utils/Auth";
import { ADD_BOOK } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";
import CommentForm from "../components/CommentForm";
import WaveDivider from "../components/WaveDivider"; // Ensure this component exists
import { fetchBestSellers } from "../components/API"; // Ensure this function exists and is correctly exported

const SingleBook = () => {
  const { id } = useParams(); // Assuming 'id' is the ISBN-10 or _id
  const navigate = useNavigate();
  const toast = useToast();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color Modes
  const bgColor = useColorModeValue("#A9D6E5", "#F0EFEB");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const badgeColor = useColorModeValue("teal", "orange");

  // Mutation Hook
  const [addToBooks] = useMutation(ADD_BOOK, {
    update(cache, { data: { addBook } }) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });

        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              books: [...me.books, addBook],
            },
          },
        });
      } catch (e) {
        console.error("Error updating cache:", e);
      }
    },
    onCompleted: () => {
      toast({
        title: "Book added to My Reads.",
        description: "You have successfully added the book to your reads.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/my-reads");
    },
    onError: (err) => {
      toast({
        title: "Error adding book.",
        description: err.message || "An error occurred while adding the book.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error adding book to books:", err);
    },
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const categories = [
          "hardcover-fiction",
          "hardcover-nonfiction",
          "childrens-middle-grade-hardcover",
          "science",
        ];

        const fetchedBooksPromises = categories.map((category) =>
          fetchBestSellers(category)
        );

        const fetchedBooksArrays = await Promise.all(fetchedBooksPromises);
        const allBooks = fetchedBooksArrays.flat();

        console.log("Fetched Books:", allBooks);

        // Find the book by ISBN-10 or _id
        const foundBook = allBooks.find(
          (bookItem) => bookItem.primary_isbn10 === id || bookItem._id === id
        );
        console.log("Found Book:", foundBook);

        setBook(foundBook);
      } catch (err) {
        setError(err.message || "Failed to fetch book data.");
        console.error("Error fetching book data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleAddToBooks = async () => {
    if (!Auth.loggedIn()) {
      toast({
        title: "Unauthorized.",
        description: "You need to be logged in to add books.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    try {
      // Call the mutation to add the book to the backend
      await addToBooks({
        variables: { bookId: book.primary_isbn10 || book._id },
      });

      // Also save the book to local storage
      const currentUser = Auth.getProfile();
      const savedBooksKey = `savedBooks_${currentUser.id}`;
      const existingBooks = JSON.parse(localStorage.getItem(savedBooksKey)) || [];

     if (!existingBooks.some(
        (savedBook) => savedBook.bookId === (book.primary_isbn10 || book._id)
      )) {
      const newBook = {
        ...book,
        bookId: book.primary_isbn10 || book._id,
      };
      existingBooks.push(newBook);
      localStorage.setItem(savedBooksKey, JSON.stringify(existingBooks));
    }

    toast({
      title: "Book added to My Reads.",
      description: "You have successfully added the book to your reads.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    navigate("/my-reads");
  } catch (err) {
    console.error("Error adding book:", err);
  }
};

  // Loading State
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
          Loading book details...
        </Text>
      </Flex>
    );
  }

  // Error State
  if (error) {
    return (
      <Container
        maxW="container.md"
        bg={bgColor}
        p={8}
        borderRadius="md"
        boxShadow="lg"
      >
        <Flex direction="column" align="center" justify="center" minH="100vh">
          <FaExclamationTriangle size={48} color="red" />
          <Text fontSize="xl" color="red.500" mt={4} textAlign="center">
            An error occurred: {error}
          </Text>
          <Button
            mt={6}
            colorScheme="teal"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Flex>
      </Container>
    );
  }

  // Book Not Found State
  if (!book) {
    return (
      <Container
        maxW="container.md"
        bg={bgColor}
        p={8}
        borderRadius="md"
        boxShadow="lg"
      >
        <Flex direction="column" align="center" justify="center" minH="100vh">
          <Text fontSize="xl" color="red.500">
            Book not found
          </Text>
          <Button
            mt={6}
            colorScheme="teal"
            leftIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Flex>
      </Container>
    );
  }

  // Main Book Details
  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      {/* Wave Divider at the Top */}
      <WaveDivider />

      {/* Container for Book Details */}
      <Container maxW="container.lg" p={6}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          bg={bgColor}
          p={6}
          borderRadius="md"
          boxShadow="lg"
        >
          {/* Book Image */}
          {book.book_image && (
            <Box flexShrink={0} mb={{ base: 4, md: 0 }} mr={{ md: 8 }}>
              <Image
                src={book.book_image}
                alt={book.title}
                borderRadius="md"
                boxShadow="md"
                maxW={{ base: "200px", md: "300px" }}
                w="100%"
                h="auto"
              />
            </Box>
          )}

          {/* Book Details */}
          <VStack align="start" spacing={4} w="full">
            {/* Back Button */}
            <Button
              variant="ghost"
              colorScheme="teal"
              leftIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Back to List
            </Button>

            {/* Title and Author */}
            {book.title && (
              <Heading as="h1" size="xl" color={textColor}>
                {book.title}
              </Heading>
            )}
            {book.author && (
              <Text fontSize="lg" color="gray.600">
                by {book.author}
              </Text>
            )}

            {/* Description */}
            {book.description && (
              <Text fontSize="md" color={textColor}>
                {book.description}
              </Text>
            )}

            {/* Additional Details */}
            <SimpleGrid columns={[1, 2]} spacing={2} w="100%">
              {book.primary_isbn10 && (
                <Badge colorScheme={badgeColor} fontSize="md" p={2}>
                  ISBN-10: {book.primary_isbn10}
                </Badge>
              )}
              {book.publisher && (
                <Badge colorScheme="blue" fontSize="md" p={2}>
                  Publisher: {book.publisher}
                </Badge>
              )}
              {book.rank && (
                <Badge colorScheme="purple" fontSize="md" p={2}>
                  Rank: {book.rank}
                </Badge>
              )}
              {book.rank_last_week && (
                <Badge colorScheme="orange" fontSize="md" p={2}>
                  Rank Last Week: {book.rank_last_week}
                </Badge>
              )}
              {book.weeks_on_list && (
                <Badge colorScheme="teal" fontSize="md" p={2}>
                  Weeks on List: {book.weeks_on_list}
                </Badge>
              )}
            </SimpleGrid>

            {/* Buy Links */}
            {book.buy_links && book.buy_links.length > 0 && (
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" color={textColor}>
                  Buy Now:
                </Text>
                {book.buy_links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    isExternal
                    color="teal.500"
                    _hover={{ textDecoration: "underline", color: "teal.700" }}
                  >
                    {link.name}
                  </Link>
                ))}
              </VStack>
            )}

            {/* Add to My Reads Button */}
            <Button
              colorScheme="orange"
              size="md"
              onClick={handleAddToBooks}
              alignSelf="stretch"
              leftIcon={<FaExclamationTriangle />}
              _hover={{ transform: "scale(1.02)" }}
            >
              Add to My Reads
            </Button>
          </VStack>
        </Flex>

        {/* Divider */}
        <Divider my={10} />

        {/* Comment Section */}
        <Box>
          <CommentForm bookId={id} />
        </Box>
      </Container>

      {/* Wave Divider at the Bottom */}
      <WaveDivider />
    </Box>
  );
};

export default SingleBook;
