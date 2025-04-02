// src/components/BookCard.jsx

import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Heading,
  Button,
  useColorModeValue,
  Badge,
  Stack,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaBookmark, FaStar } from "react-icons/fa";

const MotionBox = motion(Box);

const BookCard = ({ title, author, image, bookId, rating }) => {
  const bg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.700", "white");

  return (
    <MotionBox
      key={bookId}
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg={bg}
      boxShadow="md"
      whileHover={{ y: -5, boxShadow: "lg" }}
      transition={{ duration: 0.2 }}
      _hover={{
        bg: hoverBg,
      }}
    >
      <Box position="relative">
        {image && (
          <Image
            src={image}
            alt={title}
            objectFit="cover"
            w="100%"
            h="300px"
            loading="lazy"
            transition="transform 0.3s"
            _hover={{ transform: "scale(1.05)" }}
          />
        )}
        <Tooltip label="Add to Reading List">
          <Button
            position="absolute"
            top={2}
            right={2}
            size="sm"
            colorScheme="teal"
            variant="solid"
            borderRadius="full"
            opacity={0}
            _groupHover={{ opacity: 1 }}
            transition="opacity 0.2s"
          >
            <Icon as={FaBookmark} />
          </Button>
        </Tooltip>
      </Box>
      <Box p={6}>
        <Stack spacing={2}>
          <Heading
            as="h3"
            size="md"
            color={headingColor}
            noOfLines={2}
            _hover={{ color: "teal.500" }}
          >
            {title}
          </Heading>
          <Text color={textColor} fontSize="sm">
            by {author}
          </Text>
          {rating && (
            <Badge colorScheme="yellow" alignSelf="start">
              <Icon as={FaStar} mr={1} />
              {rating}
            </Badge>
          )}
          <Button
            as={RouterLink}
            to={`/books/${bookId}`}
            colorScheme="teal"
            size="sm"
            mt={2}
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s"
          >
            View Details
          </Button>
        </Stack>
      </Box>
    </MotionBox>
  );
};

export default BookCard;
