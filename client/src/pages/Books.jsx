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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  FaBook,
  FaUser,
  FaLaptop,
  FaChild,
  FaChalkboardTeacher,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";
import BookCard from "../components/BookCard";
import WaveDivider from "../components/WaveDivider";
import { fetchBestSellers } from "../components/API";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const categories = [
  {
    name: "Fiction",
    listName: "hardcover-fiction",
    icon: FaBook,
    bg: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
  },
  {
    name: "Nonfiction",
    listName: "hardcover-nonfiction",
    icon: FaUser,
    bg: "linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)",
  },
  {
    name: "Biography",
    listName: "hardcover-nonfiction",
    icon: FaChalkboardTeacher,
    bg: "linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)",
  },
  {
    name: "Kids",
    listName: "childrens-middle-grade-hardcover",
    icon: FaChild,
    bg: "linear-gradient(135deg, #FAD0C4 0%, #FFD1FF 100%)",
  },
  {
    name: "Technology",
    listName: "science",
    icon: FaLaptop,
    bg: "linear-gradient(135deg, #C2E9FB 0%, #A1C4FD 100%)",
  },
  {
    name: "Thriller",
    listName: "hardcover-fiction",
    icon: FaExclamationTriangle,
    bg: "linear-gradient(135deg, #FBD3E9 0%, #BB377D 100%)",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Books = () => {
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const headerColor = useColorModeValue("teal.600", "teal.300");

  useEffect(() => {
    const getBooks = async () => {
      try {
        const booksByCategory = {};
        for (const category of categories) {
          const fetchedBooks = await fetchBestSellers(category.listName);
          booksByCategory[category.name] = fetchedBooks;
          await delay(500);
        }
        setBooks(booksByCategory);
      } catch (error) {
        setError(error.message || "Failed to fetch books.");
        toast({
          title: "Error",
          description: "Failed to fetch books. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    getBooks();
  }, [toast]);

  const filteredBooks = Object.entries(books).reduce(
    (acc, [category, booksList]) => {
      acc[category] = booksList.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return acc;
    },
    {}
  );

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
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
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
        <Text fontSize="xl" mb={6}>
          Discover the bestsellers across various genres curated just for you.
        </Text>
        <InputGroup maxW="600px" mx="auto">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="white"
            color="gray.800"
            _placeholder={{ color: "gray.500" }}
            _focus={{ borderColor: "teal.500" }}
          />
        </InputGroup>
        <Button
          mt={6}
          colorScheme="teal"
          size="lg"
          _hover={{ transform: "scale(1.05)" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Explore Now
        </Button>
      </MotionBox>

      <Container maxW="container.xl">
        <Tabs variant="soft-rounded" colorScheme="teal" align="center" mb={8}>
          <TabList>
            {categories.map((category, index) => (
              <Tab key={index}>
                <Icon as={category.icon} mr={2} />
                {category.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {categories.map((category, index) => (
              <TabPanel key={index}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <SimpleGrid columns={[2, 3, 4, 5]} spacing={6}>
                    {filteredBooks[category.name]?.map((book, idx) => (
                      <BookCard
                        key={idx}
                        title={book.title}
                        author={book.author}
                        image={book.book_image}
                        bookId={book.primary_isbn10}
                        rating={book.rank}
                      />
                    ))}
                  </SimpleGrid>
                </MotionBox>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>

      <WaveDivider />
    </Box>
  );
};

export default Books;
