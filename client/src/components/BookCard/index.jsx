// src/components/BookCard.jsx

import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Heading,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

const BookCard = 
 ({title, author, image, bookId }) => {

  const bg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");

  return (
    <Box
      key={bookId}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bg}
      _hover={{
        bg: hoverBg,
      }}
    >
      {image && (
        <Image
          src={image}
          alt={title}
          objectFit="cover"
          w="100%"
          h="250px"
          loading="lazy"
        />
      )}
      <Box p={6}>
        <Heading as="h3" size="md">
          {title}
        </Heading>
        <Text>{author}</Text>
        <Button
          as={RouterLink}
          to={`/books/${bookId}`}
          colorScheme="orange"
          mt={2}
        >
          View Details
        </Button>
      </Box>
    </Box>
  );
};

export default BookCard;
