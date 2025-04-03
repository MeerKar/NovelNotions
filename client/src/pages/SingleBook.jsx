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
import Auth from "../utils/auth";
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
        // First, check if the book is in the user's reading list
        if (Auth.loggedIn()) {
          const currentUser = Auth.getProfile();
          const savedBooksKey = `savedBooks_${currentUser.id}`;
          const savedBooks =
            JSON.parse(localStorage.getItem(savedBooksKey)) || [];
          const savedBook = savedBooks.find((book) => book.bookId === id);

          if (savedBook) {
            setBook(savedBook);
            setIsInReadingList(true);
            setLoading(false);
            return;
          }
        }

        // If not in reading list, fetch from API
        const categories = [
          "hardcover-fiction",
          "hardcover-nonfiction",
          "childrens-middle-grade-hardcover",
          "science",
        ];

        // Try to get from cache first
        for (const category of categories) {
          const cachedData = localStorage.getItem(category);
          if (cachedData) {
            const { data } = JSON.parse(cachedData);
            const foundBook = data.find(
              (bookItem) =>
                bookItem.primary_isbn10 === id || bookItem._id === id
            );
            if (foundBook) {
              setBook(foundBook);
              setLoading(false);
              return;
            }
          }
        }

        // If not in cache, fetch from API
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
        } else {
          setError("Book not found.");
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
          reviews: [],
          discussions: [],
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

  const handleAddReview = (review) => {
    const currentUser = Auth.getProfile();
    const savedBooksKey = `savedBooks_${currentUser.id}`;
    const existingBooks = JSON.parse(localStorage.getItem(savedBooksKey)) || [];

    const bookIndex = existingBooks.findIndex(
      (savedBook) => savedBook.bookId === (book.primary_isbn10 || book._id)
    );

    if (bookIndex !== -1) {
      if (!existingBooks[bookIndex].reviews) {
        existingBooks[bookIndex].reviews = [];
      }
      existingBooks[bookIndex].reviews.push({
        ...review,
        username: currentUser.username,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(savedBooksKey, JSON.stringify(existingBooks));

      toast({
        title: "Review added",
        description: "Your review has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleShare = () => {
    onOpen();
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "The book's URL has been copied to your clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg={bgColor}>
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" thickness="4px" />
          <Text color={textColor}>Loading book details...</Text>
        </VStack>
      </Flex>
    );
  }

  if (error || !book) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="container.xl">
          <Button
            leftIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            mb={8}
            variant="ghost"
          >
            Go Back
          </Button>
          <Flex
            direction="column"
            align="center"
            justify="center"
            minH="50vh"
            bg={cardBg}
            borderRadius="lg"
            p={8}
          >
            <Icon
              as={FaExclamationTriangle}
              boxSize={12}
              color="red.500"
              mb={4}
            />
            <Text fontSize="xl" color="red.500" textAlign="center">
              {error || "Book not found"}
            </Text>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          mb={8}
          variant="ghost"
        >
          Go Back
        </Button>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={8}>
          <Box>
            <Image
              src={
                book.book_image ||
                "https://via.placeholder.com/200x300?text=No+Image"
              }
              alt={book.title}
              borderRadius="lg"
              w="100%"
              maxH="500px"
              objectFit="contain"
              bg={cardBg}
            />
          </Box>

          <VStack align="start" spacing={6}>
            <Heading size="2xl" color={textColor}>
              {book.title}
            </Heading>
            <Text fontSize="xl" color="gray.500">
              by {book.author}
            </Text>
            <HStack spacing={4} wrap="wrap">
              {book.rank && (
                <Badge colorScheme={badgeColor} fontSize="md" p={2}>
                  Rank #{book.rank}
                </Badge>
              )}
              {book.weeks_on_list > 0 && (
                <Badge colorScheme="purple" fontSize="md" p={2}>
                  {book.weeks_on_list} weeks on list
                </Badge>
              )}
              {book.category && (
                <Badge colorScheme="blue" fontSize="md" p={2}>
                  {book.category}
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
              {book.amazon_product_url && (
                <Button
                  leftIcon={<FaShoppingCart />}
                  colorScheme="green"
                  size="lg"
                  onClick={() => window.open(book.amazon_product_url, "_blank")}
                >
                  Buy Now
                </Button>
              )}
            </Stack>
          </VStack>
        </SimpleGrid>

        <Tabs variant="enclosed" colorScheme="teal" mt={8}>
          <TabList>
            <Tab>Reviews</Tab>
            <Tab>Details</Tab>
            <Tab>Discussion</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <CommentForm bookId={book.primary_isbn10 || book._id} />
                {book.reviews && book.reviews.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {book.reviews.map((review, index) => (
                      <Box
                        key={index}
                        p={4}
                        bg={cardBg}
                        borderRadius="md"
                        boxShadow="sm"
                      >
                        <Text fontWeight="bold">{review.username}</Text>
                        <Text color="gray.500" fontSize="sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Text>
                        <Text mt={2}>{review.reviewText}</Text>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500">
                    No reviews yet. Be the first to review!
                  </Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Heading size="md" mb={4}>
                    Book Details
                  </Heading>
                  <VStack align="start" spacing={3}>
                    <Text>
                      <strong>Publisher:</strong> {book.publisher}
                    </Text>
                    <Text>
                      <strong>ISBN:</strong> {book.primary_isbn10}
                    </Text>
                    <Text>
                      <strong>Rank Last Week:</strong>{" "}
                      {book.rank_last_week || "N/A"}
                    </Text>
                    <Text>
                      <strong>Weeks on List:</strong>{" "}
                      {book.weeks_on_list || "N/A"}
                    </Text>
                    {book.price && (
                      <Text>
                        <strong>Price:</strong> ${book.price}
                      </Text>
                    )}
                  </VStack>
                </Box>
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Box p={4} bg={cardBg} borderRadius="md">
                  <Heading size="md" mb={4}>
                    Join the Discussion
                  </Heading>
                  <Text>
                    Share your thoughts and discuss this book with other
                    readers.
                  </Text>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share this Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Copy this link to share:</Text>
            <Text color="blue.500" mt={2}>
              {window.location.href}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>

      <WaveDivider />
    </Box>
  );
};

export default SingleBook;
