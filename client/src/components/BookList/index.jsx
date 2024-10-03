import { Link } from "react-router-dom";
import { Box, Heading, Text, Button, Image } from "@chakra-ui/react";

const BookList = ({
  books, // Changed from reads to books
  title,
  showTitle = true,
  showUsername = true,
  showAuthor = true,
}) => {
  if (!books.length) {
    return (
      <Heading as="h3" size="lg">
        No Books Yet
      </Heading>
    );
  }

  return (
    <Box>
      {showTitle && (
        <Heading as="h3" size="lg" mb={4}>
          {title}
        </Heading>
      )}
      {books.map((book) => (
        <Box
          key={book._id}
          borderWidth={1}
          borderRadius="lg"
          overflow="hidden"
          mb={4}
          bg="white"
        >
          <Box p={6} bg="primary.500" color="white">
            {showUsername && book.bookReviewAuthor ? (
              <Link to={`/profiles/${book.bookReviewAuthor}`}>
                <Text fontSize="xl">{book.bookReviewAuthor}</Text>
                <Text fontSize="sm">
                  reviewed this book on{" "}
                  {new Date(book.createdAt).toLocaleDateString()}
                </Text>
              </Link>
            ) : (
              <Text fontSize="sm">
                You reviewed this book on{" "}
                {new Date(book.createdAt).toLocaleDateString()}
              </Text>
            )}
          </Box>
          <Box p={6}>
            {book.book_image && (
              <Image src={book.book_image} alt={book.title} mb={4} />
            )}
            <Heading as="h4" size="md" mb={2}>
              {book.title}
            </Heading>
            {showAuthor && (
              <Text fontSize="lg" color="gray.600" mb={2}>
                by {book.author}
              </Text>
            )}
            <Text mb={4}>{book.description}</Text>
            <Button as={Link} to={`/books/${book._id}`} colorScheme="orange">
              View Details
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default BookList;
