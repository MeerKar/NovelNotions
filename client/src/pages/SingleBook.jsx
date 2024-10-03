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
  Link,
} from "@chakra-ui/react";
import { fetchBestSellers } from "../components/API"; // Ensure this path is correct
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { ADD_BOOK } from "../utils/mutations";
import CommentForm from "../components/CommentForm";
import { QUERY_ME } from "../utils/queries";
const SingleBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        // Fetch books from both categories
        const fictionBooks = await fetchBestSellers("hardcover-fiction");
        const nonFictionBooks = await fetchBestSellers("hardcover-nonfiction");
        const Biography = await fetchBestSellers("hardcover-nonfiction");
        const Kids = await fetchBestSellers("childrens-middle-grade-hardcover");
        const Technology = await fetchBestSellers("science");
        const Thriller = await fetchBestSellers("hardcover-fiction");

        console.log("Fetched Fiction Books:", fictionBooks);
        console.log("Fetched Non-Fiction Books:", nonFictionBooks);

        // Combine both fiction and non-fiction books
        const allBooks = [
          ...fictionBooks,
          ...nonFictionBooks,
          ...Biography,
          ...Kids,
          ...Technology,
          ...Thriller,
        ];

        // Find the book by ISBN
        const foundBook = allBooks.find((book) => book.primary_isbn10 === id);
        console.log("Found Book:", foundBook);

        setBook(foundBook);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const [addToBooks] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      navigate("/my-reads"); // Navigate to MyReads page
    },
    onError: (err) => {
      console.error("Error adding book to books:", err);
    },
  });

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg="#f8ede3">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    console.error("Error fetching book data:", error);
    return (
      <Container maxW="container.md" bg="#f8ede3">
        <Flex direction="column" align="center" justify="center" minH="100vh">
          <Text fontSize="xl" color="red.500">
            An error occurred: {error}
          </Text>
        </Flex>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxW="container.md" bg="#f8ede3">
        <Flex direction="column" align="center" justify="center" minH="100vh">
          <Text fontSize="xl" color="red.500">
            Book not found
          </Text>
        </Flex>
      </Container>
    );
  }

  const handleAddToBooks = async () => {
    try {
      await addToBooks({
        variables: { bookId: id, userId: Auth.getProfile().data._id },
        refetchQueries: [{ query: QUERY_ME }], // Refetch user data after mutation
      });
      navigate("/my-reads"); // Navigate to MyReads page after adding the book
    } catch (err) {
      console.error("Error adding book to books:", err);
    }
  };

  return (
    <Container
      maxW="container.md"
      bg="#f8ede3"
      p={8}
      borderRadius="md"
      boxShadow="lg"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
        minH="100vh"
      >
        {book.book_image && (
          <Box flexShrink={0} mb={{ base: 4, md: 0 }} mr={{ md: 8 }}>
            <Image
              src={book.book_image}
              alt={book.title}
              borderRadius="md"
              boxShadow="md"
            />
          </Box>
        )}
        <VStack align="start" spacing={4}>
          {book.title && (
            <Heading as="h1" size="xl">
              {book.title}
            </Heading>
          )}
          {book.author && (
            <Text fontSize="lg" color="gray.600">
              {book.author}
            </Text>
          )}
          {book.description && <Text fontSize="md">{book.description}</Text>}
          {book.primary_isbn10 && (
            <Text fontSize="md">
              <b>ISBN-10:</b> {book.primary_isbn10}
            </Text>
          )}
          {book.publisher && (
            <Text fontSize="md">
              <b>Publisher:</b> {book.publisher}
            </Text>
          )}
          <SimpleGrid columns={2} spacing={4}>
            {book.rank && (
              <Badge colorScheme="green" fontSize="md">
                Rank: {book.rank}
              </Badge>
            )}
            {book.rank_last_week && (
              <Badge colorScheme="blue" fontSize="md">
                Rank Last Week: {book.rank_last_week}
              </Badge>
            )}
            {book.weeks_on_list && (
              <Badge colorScheme="purple" fontSize="md">
                Weeks on List: {book.weeks_on_list}
              </Badge>
            )}
          </SimpleGrid>
          {book.buy_links &&
            book.buy_links.map((link, index) => (
              <Link key={index} href={link.url} isExternal color="blue.500">
                Buy from {link.name}
              </Link>
            ))}
          <Button colorScheme="orange" size="md" onClick={handleAddToBooks}>
            Add to MyReads
          </Button>

          <CommentForm bookId={id} />
        </VStack>
      </Flex>
    </Container>
  );
};

export default SingleBook;
