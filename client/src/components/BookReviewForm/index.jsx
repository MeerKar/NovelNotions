import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Input,
  Textarea,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Flex,
  Container,
  Alert,
  AlertIcon,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { ADD_REVIEW, ADD_BOOK } from "../../utils/mutations";
import { QUERY_SINGLE_BOOK, QUERY_ME, QUERY_BOOKS } from "../../utils/queries";
import Auth from "../../utils/auth";

const BookReviewForm = () => {
  const { id } = useParams();
  const { loading, data, error } = useQuery(QUERY_SINGLE_BOOK, {
    variables: { bookId: id },
  });

  const [reviewText, setReviewText] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: QUERY_BOOKS }, { query: QUERY_ME }],
  });

  const [addReview, { error: reviewError, data: submitData }] = useMutation(
    ADD_REVIEW,
    {
      refetchQueries: [{ query: QUERY_BOOKS }, { query: QUERY_ME }],
    }
  );

  const handleChange = (event) => {
    const { value } = event.target;
    if (value.length <= 280) {
      setReviewText(value);
      setCharacterCount(value.length);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitLoading(true);

    try {
      // Ensure book data is available
      if (!data?.book) {
        throw new Error("Book data not found");
      }

      // Check if the book already exists in the user's collection
      const existingBook = data?.book;
      if (!existingBook) {
        // Add book to the collection if not already present
        await addBook({
          variables: {
            title: data.book.title,
            author: data.book.author,
            image: data.book.image,
            description: data.book.description,
          },
        });
      }

      // Add review for the book
      await addReview({
        variables: {
          bookId: id,
          reviewText,
          userId: Auth.getProfile().data._id,
        },
      });

      // Reset form after submission
      setReviewText("");
      setCharacterCount(0);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md">
        <Flex direction="column" align="center" justify="center" minH="100vh">
          <Text fontSize="xl" color="red.500">
            An error occurred: {error.message}
          </Text>
        </Flex>
      </Container>
    );
  }

  const book = data?.book || {};

  return (
    <Container maxW="container.md">
      <Flex direction="column" align="center" justify="center" minH="100vh">
        <Box w="100%" p={6} boxShadow="md" borderRadius="md">
          <Heading as="h4" size="lg" mb={6} textAlign="center">
            Add a Book Review
          </Heading>
          <Image src={book.image} alt={book.title} mb={4} />
          {submitData ? (
            <Text>
              Success! You may now head <Link to="/my-reads">to My Reads.</Link>
            </Text>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormControl id="title" isRequired mb={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  placeholder="Book title"
                  name="title"
                  type="text"
                  value={book.title}
                  readOnly
                />
              </FormControl>
              <FormControl id="author" isRequired mb={4}>
                <FormLabel>Author</FormLabel>
                <Input
                  placeholder="Book author"
                  name="author"
                  type="text"
                  value={book.author}
                  readOnly
                />
              </FormControl>
              <FormControl id="reviewText" isRequired mb={6}>
                <FormLabel>Review</FormLabel>
                <Textarea
                  placeholder="Here's a new review..."
                  name="reviewText"
                  value={reviewText}
                  onChange={handleChange}
                  mb={4}
                />
                <Text
                  mb={2}
                  color={
                    characterCount === 280 || reviewError
                      ? "red.500"
                      : "gray.600"
                  }
                >
                  Character Count: {characterCount}/280
                </Text>
              </FormControl>
              <Button
                colorScheme="blue"
                width="100%"
                type="submit"
                isLoading={submitLoading}
              >
                Add a review
              </Button>
            </form>
          )}
          {reviewError && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {reviewError.message}
            </Alert>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default BookReviewForm;
