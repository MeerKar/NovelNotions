import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Text,
  Textarea,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import Auth from "../../utils/Auth";

const CommentForm = ({ bookId, onAddComment }) => {
  const [reviewText, setReviewText] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const toast = useToast();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!Auth.loggedIn()) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to add a review",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (characterCount < 10) {
      toast({
        title: "Review too short",
        description: "Please write at least 10 characters",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const currentUser = Auth.getProfile();
      const review = {
        reviewText,
        username: currentUser.username,
        createdAt: new Date().toISOString(),
      };

      // Update local storage
      const savedBooksKey = `savedBooks_${currentUser.id}`;
      const savedBooks = JSON.parse(localStorage.getItem(savedBooksKey)) || [];
      const bookIndex = savedBooks.findIndex((book) => book.bookId === bookId);

      if (bookIndex !== -1) {
        if (!savedBooks[bookIndex].reviews) {
          savedBooks[bookIndex].reviews = [];
        }
        savedBooks[bookIndex].reviews.push(review);
        localStorage.setItem(savedBooksKey, JSON.stringify(savedBooks));

        if (onAddComment) {
          onAddComment(review);
        }

        toast({
          title: "Review added",
          description: "Your review has been added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setReviewText("");
        setCharacterCount(0);
      } else {
        toast({
          title: "Error",
          description: "Book not found in your reading list",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error adding review:", err);
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setReviewText(value);
    setCharacterCount(value.length);
  };

  return (
    <Box>
      <Heading as="h4" size="md" mb={4}>
        What do you think of this book?
      </Heading>

      {Auth.loggedIn() ? (
        <>
          <Text
            mb={4}
            color={
              characterCount > 280
                ? "red.500"
                : characterCount < 10
                ? "gray.500"
                : "green.500"
            }
          >
            Character Count: {characterCount}/280
            {characterCount < 10 && (
              <Text as="span" color="gray.500">
                {" "}
                - Minimum 10 characters required
              </Text>
            )}
          </Text>
          <VStack
            as="form"
            onSubmit={handleFormSubmit}
            spacing={4}
            align="stretch"
          >
            <Textarea
              name="reviewText"
              placeholder="Share your thoughts about this book..."
              value={reviewText}
              onChange={handleChange}
              resize="vertical"
              minH="100px"
              maxLength={280}
            />
            <Button
              type="submit"
              colorScheme="teal"
              isDisabled={characterCount < 10}
              width="fit-content"
            >
              Add Review
            </Button>
          </VStack>
        </>
      ) : (
        <Text>
          You need to be logged in to share your thoughts. Please{" "}
          <Link to="/login" style={{ color: "#319795" }}>
            login
          </Link>{" "}
          or{" "}
          <Link to="/signup" style={{ color: "#319795" }}>
            signup
          </Link>
          .
        </Text>
      )}
    </Box>
  );
};

export default CommentForm;
