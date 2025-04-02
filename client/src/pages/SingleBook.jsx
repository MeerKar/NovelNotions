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
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  FaExclamationTriangle,
  FaBookmark,
  FaShare,
  FaStar,
  FaShoppingCart,
} from "react-icons/fa";
import { useMutation } from "@apollo/client";
import Auth from "../utils/Auth";
import { ADD_BOOK } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";
import CommentForm from "../components/CommentForm";
import WaveDivider from "../components/WaveDivider";
import { fetchBestSellers } from "../components/API";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const SingleBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInReadingList, setIsInReadingList] = useState(false);

  // Color Modes
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const badgeColor = useColorModeValue("teal", "orange");
  const cardBg = useColorModeValue("gray.50", "gray.700");

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
      setIsInReadingList(true);
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

        const foundBook = allBooks.find(
          (bookItem) => bookItem.primary_isbn10 === id || bookItem._id === id
        );

        if (foundBook) {
          setBook(foundBook);
          // Check if book is in user's reading list
          if (Auth.loggedIn()) {
            const currentUser = Auth.getProfile();
            const savedBooksKey = `savedBooks_${currentUser.id}`;
            const existingBooks =
              JSON.parse(localStorage.getItem(savedBooksKey)) || [];
            setIsInReadingList(
              existingBooks.some(
                (savedBook) =>
                  savedBook.bookId ===
                  (foundBook.primary_isbn10 || foundBook._id)
              )
            );
          }
        }
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
      await addToBooks({
        variables: { bookId: book.primary_isbn10 || book._id },
      });

      const currentUser = Auth.getProfile();
      const savedBooksKey = `savedBooks_${currentUser.id}`;
      const existingBooks =
        JSON.parse(localStorage.getItem(savedBooksKey)) || [];

      if (
        !existingBooks.some(
          (savedBook) => savedBook.bookId === (book.primary_isbn10 || book._id)
        )
      ) {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author}`,
        url: window.location.href,
      });
    } else {
      onOpen();
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

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            mb={6}
            onClick={() => navigate(-1)}
          >
            Back to Books
          </Button>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {/* Book Image */}
            <Box>
              <Image
                src={book.book_image}
                alt={book.title}
                borderRadius="lg"
                boxShadow="xl"
                w="100%"
                h="auto"
                objectFit="cover"
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.02)" }}
              />
            </Box>

            {/* Book Details */}
            <VStack align="start" spacing={6}>
              <Heading size="2xl" color={textColor}>
                {book.title}
              </Heading>
              <Text fontSize="xl" color="gray.500">
                by {book.author}
              </Text>
              <HStack spacing={4}>
                <Badge colorScheme={badgeColor} fontSize="md" p={2}>
                  Rank: #{book.rank}
                </Badge>
                {book.weeks_on_list > 0 && (
                  <Badge colorScheme="purple" fontSize="md" p={2}>
                    {book.weeks_on_list} weeks on list
                  </Badge>
                )}
              </HStack>
              <Text fontSize="lg" color={textColor}>
                {book.description}
              </Text>
              <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                <Button
                  leftIcon={<FaBookmark />}
                  colorScheme="teal"
                  size="lg"
                  onClick={handleAddToBooks}
                  isDisabled={isInReadingList}
                >
                  {isInReadingList ? "In Reading List" : "Add to Reading List"}
                </Button>
                <Button
                  leftIcon={<FaShare />}
                  colorScheme="blue"
                  size="lg"
                  onClick={handleShare}
                >
                  Share
                </Button>
                <Button
                  leftIcon={<FaShoppingCart />}
                  colorScheme="green"
                  size="lg"
                  onClick={() => window.open(book.amazon_product_url, "_blank")}
                >
                  Buy Now
                </Button>
              </Stack>
            </VStack>
          </SimpleGrid>

          {/* Additional Information */}
          <Box mt={12}>
            <Tabs variant="soft-rounded" colorScheme="teal">
              <TabList>
                <Tab>Details</Tab>
                <Tab>Reviews</Tab>
                <Tab>Discussion</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box bg={cardBg} p={6} borderRadius="lg">
                      <Heading size="md" mb={4}>
                        Book Details
                      </Heading>
                      <Stack spacing={3}>
                        <Text>
                          <strong>Publisher:</strong> {book.publisher}
                        </Text>
                        <Text>
                          <strong>ISBN:</strong> {book.primary_isbn10}
                        </Text>
                        <Text>
                          <strong>Price:</strong> ${book.price}
                        </Text>
                        <Text>
                          <strong>Age Group:</strong> {book.age_group}
                        </Text>
                      </Stack>
                    </Box>
                    <Box bg={cardBg} p={6} borderRadius="lg">
                      <Heading size="md" mb={4}>
                        Contributor
                      </Heading>
                      <Stack spacing={3}>
                        <Text>
                          <strong>Author:</strong> {book.author}
                        </Text>
                        <Text>
                          <strong>Contributor:</strong> {book.contributor}
                        </Text>
                      </Stack>
                    </Box>
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <Box bg={cardBg} p={6} borderRadius="lg">
                    <Heading size="md" mb={4}>
                      Reviews
                    </Heading>
                    <Text>Reviews coming soon...</Text>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box bg={cardBg} p={6} borderRadius="lg">
                    <Heading size="md" mb={4}>
                      Discussion
                    </Heading>
                    <CommentForm bookId={book.primary_isbn10} />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </MotionBox>
      </Container>

      {/* Share Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <Button
                leftIcon={<FaShare />}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({
                    title: "Link copied!",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                  });
                }}
              >
                Copy Link
              </Button>
              <Button
                leftIcon={<FaShare />}
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Check out "${book.title}" by ${book.author}`
                    )}&url=${encodeURIComponent(window.location.href)}`,
                    "_blank"
                  )
                }
              >
                Share on Twitter
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <WaveDivider />
    </Box>
  );
};

export default SingleBook;
