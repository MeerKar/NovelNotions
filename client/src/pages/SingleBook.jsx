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
  Button,
  ButtonGroup,
  SimpleGrid,
  Badge,
  useColorModeValue,
  useToast,
  Icon,
  Stack,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
} from "@chakra-ui/react";
import { ArrowBackIcon, StarIcon } from "@chakra-ui/icons";
import {
  FaBookmark,
  FaShare,
  FaShoppingCart,
  FaStar,
  FaStarHalf,
  FaComment,
  FaCalendarAlt,
} from "react-icons/fa";
import Auth from "../utils/auth";
import CommentForm from "../components/CommentForm";

const ReviewCard = ({ review }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Card bg={cardBg} shadow="md" p={4}>
      <HStack spacing={4} mb={4}>
        <Avatar name={review.username} size="sm" />
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold" color={textColor}>
            {review.username}
          </Text>
          <Text fontSize="sm" color="gray.500">
            <Icon as={FaCalendarAlt} mr={2} />
            {new Date(review.createdAt).toLocaleDateString()}
          </Text>
        </VStack>
      </HStack>
      <HStack spacing={1} mb={2}>
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            as={StarIcon}
            color={i < review.rating ? "yellow.400" : "gray.300"}
          />
        ))}
      </HStack>
      <Text color={textColor}>{review.reviewText}</Text>
    </Card>
  );
};

const SingleBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [book, setBook] = useState(null);
  const [isInReadingList, setIsInReadingList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  // Color Modes
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const badgeColor = useColorModeValue("teal", "orange");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const emptyStateBg = useColorModeValue("gray.50", "gray.700");
  const shareLinkBg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // Check reading list first
        if (Auth.loggedIn()) {
          const currentUser = Auth.getProfile();
          const savedBooksKey = `savedBooks_${currentUser.id}`;
          const savedBooks =
            JSON.parse(localStorage.getItem(savedBooksKey)) || [];
          const savedBook = savedBooks.find(
            (book) => book.primary_isbn10 === id || book.primary_isbn13 === id
          );

          if (savedBook) {
            setBook(savedBook);
            setIsInReadingList(true);
            setLoading(false);
            return;
          }
        }

        // Fetch book cover from Google Books API
        const googleBooksResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${id}`
        );
        const googleBooksData = await googleBooksResponse.json();

        let bookImage = "https://via.placeholder.com/200x300?text=No+Cover";
        let bookDescription = "No description available.";
        let bookTitle = "Unknown Title";
        let bookAuthor = "Unknown Author";
        let bookPublisher = "Unknown Publisher";

        if (googleBooksData.items && googleBooksData.items[0]) {
          const bookInfo = googleBooksData.items[0].volumeInfo;
          bookImage =
            bookInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
            bookImage;
          bookDescription = bookInfo.description || bookDescription;
          bookTitle = bookInfo.title || bookTitle;
          bookAuthor = bookInfo.authors?.[0] || bookAuthor;
          bookPublisher = bookInfo.publisher || bookPublisher;
        }

        // Create book object with fetched details
        const newBook = {
          primary_isbn10: id,
          primary_isbn13: id,
          title: bookTitle,
          author: bookAuthor,
          description: bookDescription,
          publisher: bookPublisher,
          book_image: bookImage,
          amazon_product_url: `https://www.amazon.com/dp/${id}`,
          rank: 1,
          rank_last_week: 2,
          weeks_on_list: 5,
          price: "19.99",
          ratings: [],
          reviews: [],
        };

        setBook(newBook);
      } catch (error) {
        console.error("Error fetching book details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch book details. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, toast]);

  // Add this new useEffect to fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/books/${id}/reviews`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (book) {
      fetchReviews();
    }
  }, [id, book]);

  const handleAddToReadingList = () => {
    if (!Auth.loggedIn()) {
      toast({
        title: "Login Required",
        description: "Please log in to add books to your reading list.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    try {
      const currentUser = Auth.getProfile();
      const savedBooksKey = `savedBooks_${currentUser.id}`;
      const savedBooks = JSON.parse(localStorage.getItem(savedBooksKey)) || [];

      if (
        !savedBooks.some(
          (savedBook) => savedBook.primary_isbn10 === book.primary_isbn10
        )
      ) {
        savedBooks.push({
          ...book,
          addedAt: new Date().toISOString(),
        });
        localStorage.setItem(savedBooksKey, JSON.stringify(savedBooks));

        setIsInReadingList(true);
        toast({
          title: "Success!",
          description: "Book added to your reading list.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error adding book to reading list:", err);
      toast({
        title: "Error",
        description: "Failed to add book to reading list.",
        status: "error",
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

  const handleReviewSuccess = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
    toast({
      title: "Review added",
      description: "Your review has been added successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
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
          <Flex justify="center" align="center" minH="50vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="teal.500" thickness="4px" />
              <Text color={textColor}>Loading book details...</Text>
            </VStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (!book) {
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
          <Text>Book not found.</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Container maxW="container.xl">
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          mb={8}
          variant="ghost"
          size="lg"
          _hover={{ bg: hoverBg }}
        >
          Go Back
        </Button>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} mb={8}>
          <VStack spacing={8}>
            <Card
              maxW="xl"
              bg={cardBg}
              overflow="hidden"
              boxShadow="2xl"
              borderRadius="xl"
            >
              <CardBody>
                <Image
                  src={book.book_image}
                  alt={book.title}
                  borderRadius="lg"
                  w="100%"
                  h="500px"
                  objectFit="cover"
                  boxShadow="lg"
                  transition="0.3s"
                  _hover={{ transform: "scale(1.02)" }}
                />
                <Stack mt="8" spacing="4">
                  <Heading size="xl" color={textColor} lineHeight="1.2">
                    {book.title}
                  </Heading>
                  <Text fontSize="xl" color="gray.500" fontStyle="italic">
                    by {book.author}
                  </Text>
                  <Text
                    color={textColor}
                    fontSize="lg"
                    lineHeight="tall"
                    noOfLines={4}
                  >
                    {book.description}
                  </Text>
                  <HStack spacing={2} my={2}>
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        as={i < Math.floor(4.5) ? FaStar : FaStarHalf}
                        color="yellow.400"
                        w={6}
                        h={6}
                      />
                    ))}
                    <Text color="gray.500" fontSize="lg" fontWeight="bold">
                      (4.5)
                    </Text>
                  </HStack>
                  <Text color="blue.600" fontSize="3xl" fontWeight="bold">
                    ${book.price}
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="4" width="100%">
                  <Button
                    leftIcon={<FaBookmark />}
                    colorScheme="teal"
                    size="lg"
                    flex="1"
                    onClick={handleAddToReadingList}
                    isDisabled={isInReadingList}
                    _hover={{ transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  >
                    {isInReadingList
                      ? "In Reading List"
                      : "Add to Reading List"}
                  </Button>
                  <Button
                    leftIcon={<FaShare />}
                    colorScheme="blue"
                    size="lg"
                    onClick={handleShare}
                    _hover={{ transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  >
                    Share
                  </Button>
                  {book.amazon_product_url && (
                    <Button
                      leftIcon={<FaShoppingCart />}
                      colorScheme="green"
                      size="lg"
                      onClick={() =>
                        window.open(book.amazon_product_url, "_blank")
                      }
                      _hover={{ transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                    >
                      Buy Now
                    </Button>
                  )}
                </ButtonGroup>
              </CardFooter>
            </Card>
          </VStack>

          <VStack align="stretch" spacing={8}>
            <Card
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="xl"
              border="1px"
              borderColor={borderColor}
            >
              <Heading size="lg" mb={6} color={textColor}>
                Book Details
              </Heading>
              <SimpleGrid columns={2} spacing={4}>
                <VStack align="start" spacing={4}>
                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      Publisher
                    </Text>
                    <Text color="gray.500">{book.publisher}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      ISBN-10
                    </Text>
                    <Text color="gray.500">{book.primary_isbn10}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      ISBN-13
                    </Text>
                    <Text color="gray.500">{book.primary_isbn13}</Text>
                  </Box>
                </VStack>
                <VStack align="start" spacing={4}>
                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      Rank Last Week
                    </Text>
                    <Text color="gray.500">{book.rank_last_week || "N/A"}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      Weeks on List
                    </Text>
                    <Text color="gray.500">{book.weeks_on_list || "N/A"}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      Price
                    </Text>
                    <Text color="gray.500">${book.price}</Text>
                  </Box>
                </VStack>
              </SimpleGrid>
            </Card>

            <Card
              bg={cardBg}
              borderRadius="xl"
              boxShadow="xl"
              border="1px"
              borderColor={borderColor}
              overflow="hidden"
            >
              <Tabs variant="soft-rounded" colorScheme="teal" p={6}>
                <TabList mb={6}>
                  <Tab
                    _selected={{
                      color: "white",
                      bg: "teal.500",
                    }}
                    borderRadius="full"
                  >
                    <Icon as={FaStar} mr={2} />
                    Reviews ({reviews.length})
                  </Tab>
                  <Tab
                    _selected={{
                      color: "white",
                      bg: "teal.500",
                    }}
                    borderRadius="full"
                  >
                    <Icon as={FaComment} mr={2} />
                    Add Review
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <VStack spacing={6} align="stretch">
                      {reviews && reviews.length > 0 ? (
                        reviews.map((review, index) => (
                          <ReviewCard key={index} review={review} />
                        ))
                      ) : (
                        <Box
                          textAlign="center"
                          py={8}
                          bg={emptyStateBg}
                          borderRadius="lg"
                        >
                          <Icon
                            as={FaComment}
                            w={10}
                            h={10}
                            color="gray.400"
                            mb={4}
                          />
                          <Text color="gray.500" fontSize="lg">
                            No reviews yet. Be the first to review this book!
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </TabPanel>
                  <TabPanel px={0}>
                    <CommentForm
                      bookId={book.primary_isbn10}
                      onSuccess={handleReviewSuccess}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Card>
          </VStack>
        </SimpleGrid>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>Share this Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={4}>Copy this link to share:</Text>
            <Box
              p={4}
              bg={shareLinkBg}
              borderRadius="md"
              fontSize="sm"
              wordBreak="break-all"
            >
              {window.location.href}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SingleBook;
