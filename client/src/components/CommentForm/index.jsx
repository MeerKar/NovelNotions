import { useState } from "react";
import {
  Box,
  Button,
  Text,
  Textarea,
  VStack,
  Heading,
  useToast,
  FormControl,
  FormLabel,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { ADD_REVIEW } from "../../utils/mutations";
import Auth from "../../utils/auth";

const CommentForm = ({ bookId, onSuccess }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [characterCount, setCharacterCount] = useState(0);
  const toast = useToast();

  const [addReview, { error }] = useMutation(ADD_REVIEW, {
    onCompleted: () => {
      if (onSuccess) onSuccess();
      toast({
        title: "Review added",
        description: "Your review has been added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setReviewText("");
      setRating(5);
      setCharacterCount(0);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

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
      await addReview({
        variables: {
          bookId,
          reviewText,
          rating: parseInt(rating),
        },
      });
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setReviewText(value);
    setCharacterCount(value.length);
  };

  return (
    <Box as="form" onSubmit={handleFormSubmit}>
      <VStack spacing={4} align="stretch">
        <Heading size="md">Add a Review</Heading>

        <FormControl>
          <FormLabel>Rating</FormLabel>
          <NumberInput
            max={5}
            min={1}
            value={rating}
            onChange={(value) => setRating(value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Your Review</FormLabel>
          <Textarea
            value={reviewText}
            onChange={handleChange}
            placeholder="Share your thoughts about this book..."
            rows={4}
          />
          <Text
            fontSize="sm"
            color={characterCount >= 280 ? "red.500" : "gray.500"}
            mt={2}
          >
            {characterCount}/280 characters
          </Text>
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          isDisabled={!reviewText.trim() || characterCount < 10}
        >
          Add Review
        </Button>
      </VStack>
    </Box>
  );
};

export default CommentForm;
