// src/pages/Books.jsx

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Container,
  SimpleGrid,
  Spinner,
  Text,
  Icon,
  Stack,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import {
  FaBook,
  FaUser,
  FaLaptop,
  FaChild,
  FaChalkboardTeacher,
  FaExclamationTriangle,
} from "react-icons/fa";
import BookCard from "../components/BookCard";
import WaveDivider from "../components/WaveDivider"; // Import the WaveDivider component
import { fetchBestSellers } from "../components/API"; // Ensure this path is correct
import { motion } from "framer-motion";

// Define motion-enabled Box
const MotionBox = motion(Box);

// Categories with unique background colors
const categories = [
  {
    name: "Fiction",
    listName: "hardcover-fiction",
    icon: FaBook,
    bg: "linear-gradient(to right, #FFDEE9, #B5FFFC)",
  },
  {
    name: "Nonfiction",
    listName: "hardcover-nonfiction",
    icon: FaUser,
    bg: "linear-gradient(to right, #D4FC79, #96E6A1)",
  },
  {
    name: "Biography",
    listName: "hardcover-nonfiction",
    icon: FaChalkboardTeacher,
    bg: "linear-gradient(to right, #A1C4FD, #C2E9FB)",
  },
  {
    name: "Kids",
    listName: "childrens-middle-grade-hardcover",
    icon: FaChild,
    bg: "linear-gradient(to right, #FAD0C4, #FFD1FF)",
  },
  {
    name: "Technology",
    listName: "science",
    icon: FaLaptop,
    bg: "linear-gradient(to right, #C2E9FB, #A1C4FD)",
  },
  {
    name: "Thriller",
    listName: "hardcover-fiction",
    icon: FaExclamationTriangle,
    bg: "linear-gradient(to right, #FBD3E9, #BB377D)",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Books = () => {
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const headerColor = useColorModeValue("teal.600", "teal.300");

  useEffect(() => {
    const getBooks = async () => {
      try {
        const booksByCategory = {};
        for (const category of categories) {
          const fetchedBooks = await fetchBestSellers(category.listName);
          booksByCategory[category.name] = fetchedBooks;
          console.log(`Books for category ${category.name}:`, fetchedBooks);
          await delay(500); // Reduced delay for better user experience
        }
        setBooks(booksByCategory);
      } catch (error) {
        setError(error.message || "Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };
    getBooks();
  }, []);

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
          Loading bestsellers...
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        bg={bgColor}
        px={4}
      >
        <Icon as={FaExclamationTriangle} boxSize={12} color="red.500" />
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
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      {/* Hero Section */}
      <Box
        bgGradient="linear(to-r, #D1E8E2, blue.500)"
        color="white"
        py={20}
        px={[4, 6, 8]}
        textAlign="center"
        borderRadius="md"
        mb={10}
      >
        <Heading as="h1" size="2xl" mb={4}>
          Every Book Opens a World of Possibilities
        </Heading>
        <Text fontSize="xl">
          Discover the bestsellers across various genres curated just for you.
        </Text>
        <Button
          mt={6}
          colorScheme="teal"
          size="lg"
          _hover={{ transform: "scale(1.05)" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Explore Now
        </Button>
      </Box>

      <Container maxW="container.xl">
        {" "}
        {/* Increased from container.lg to container.xl */}
        <Stack spacing={16}>
          {categories.map((category, index) => (
            <MotionBox
              key={index}
              bg={category.bg}
              p={8}
              borderRadius="md"
              boxShadow="md"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Category Header */}
              <Flex align="center" mb={6}>
                <Icon
                  as={category.icon}
                  w={8}
                  h={8}
                  color={headerColor}
                  mr={3}
                />
                <Heading as="h2" size="lg">
                  {category.name}
                </Heading>
              </Flex>

              {/* Book Grid */}
              <SimpleGrid columns={[2, 3, 4, 5, 6]} spacing={6}>
                {books[category.name].map((book, idx) => (
                  <BookCard
                    key={idx}
                    title={book.title}
                    author={book.author}
                    image={book.book_image}
                    bookId={book.primary_isbn10}
                    rating={book.rating} // Optional: If your data includes ratings
                  />
                ))}
              </SimpleGrid>
            </MotionBox>
          ))}
        </Stack>
      </Container>

      {/* Wave Divider at the Bottom */}
      <WaveDivider />
    </Box>
  );
};

export default Books;
