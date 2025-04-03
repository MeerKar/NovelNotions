// src/pages/Books.jsx

import { useEffect, useState, useCallback } from "react";
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import {
  FaBook,
  FaUser,
  FaLaptop,
  FaChild,
  FaChalkboardTeacher,
  FaExclamationTriangle,
  FaSearch,
  FaSync,
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

const Books = () => {
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const headerColor = useColorModeValue("teal.600", "teal.300");

  const fetchCategoryBooks = useCallback(
    async (category) => {
      const controller = new AbortController();

      try {
        setLoading((prev) => ({ ...prev, [category.name]: true }));
        setError((prev) => ({ ...prev, [category.name]: null }));

        const fetchedBooks = await fetchBestSellers(category.listName, {
          signal: controller.signal,
        });

        setBooks((prev) => ({
          ...prev,
          [category.name]: fetchedBooks,
        }));
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error(`Error fetching ${category.name} books:`, error);
        setError((prev) => ({
          ...prev,
          [category.name]: error.message,
        }));

        toast({
          title: `Error loading ${category.name} books`,
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading((prev) => ({ ...prev, [category.name]: false }));
      }

      return () => controller.abort();
    },
    [toast]
  );

  useEffect(() => {
    const fetchAllBooks = async () => {
      const promises = categories.map((category) =>
        fetchCategoryBooks(category)
      );
      await Promise.allSettled(promises);
    };

    fetchAllBooks();
  }, [fetchCategoryBooks]);

  const handleRetry = async (category) => {
    await fetchCategoryBooks(category);
  };

  const filteredBooks = Object.entries(books).reduce(
    (acc, [category, booksList]) => {
      if (!booksList) return acc;

      acc[category] = booksList.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return acc;
    },
    {}
  );

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        textAlign="center"
        py={20}
        px={6}
        bg={`linear-gradient(135deg, ${useColorModeValue(
          "#f6f6f6, #fff",
          "#2d3748, #1a202c"
        )})`}
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
                  {loading[category.name] ? (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py={10}
                    >
                      <Spinner size="xl" color="teal.500" mb={4} />
                      <Text>Loading {category.name} books...</Text>
                    </Flex>
                  ) : error[category.name] ? (
                    <Alert
                      status="error"
                      variant="subtle"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      textAlign="center"
                      height="200px"
                      borderRadius="lg"
                    >
                      <AlertIcon boxSize="40px" mr={0} />
                      <AlertTitle mt={4} mb={1} fontSize="lg">
                        Failed to load {category.name} books
                      </AlertTitle>
                      <AlertDescription maxWidth="sm" mb={4}>
                        {error[category.name]}
                      </AlertDescription>
                      <Button
                        leftIcon={<FaSync />}
                        colorScheme="teal"
                        onClick={() => handleRetry(category)}
                      >
                        Retry
                      </Button>
                    </Alert>
                  ) : (
                    <SimpleGrid columns={[2, 3, 4, 5]} spacing={6}>
                      {filteredBooks[category.name]?.map((book, idx) => (
                        <BookCard
                          key={`${book.primary_isbn10}-${idx}`}
                          title={book.title}
                          author={book.author}
                          image={book.book_image}
                          bookId={book.primary_isbn10}
                          rating={book.rank}
                        />
                      ))}
                    </SimpleGrid>
                  )}
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
