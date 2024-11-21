import {
  Box,
  Image,
  Badge,
  Button,
  Text,
  Stack,
  Heading,
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useState } from "react";
import DOMPurify from "dompurify";

const ClubCard = ({ club, isJoined, onJoin, onLeave }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.700", "gray.200");

  // State to handle image loading
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!club) return null;

  // Fallback image if club.image is missing
  const fallbackImage = "https://via.placeholder.com/400x200?text=No+Image";

  // Sanitize the description
  const sanitizedDescription = DOMPurify.sanitize(club.description);

  return (
    <Box
      maxW={{ base: "100%", sm: "sm" }}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      boxShadow="md"
      _hover={{
        boxShadow: "xl",
        transform: "scale(1.05)",
        transition: "all 0.3s ease",
      }}
      transition="all 0.3s ease"
    >
      {/* Skeleton Loader for Image */}
      <Skeleton isLoaded={imageLoaded} height="200px" width="100%">
        <Image
          src={club.image || fallbackImage}
          alt={`${club.name} Image`}
          height="200px"
          width="100%"
          objectFit="cover"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = fallbackImage;
            setImageLoaded(true);
          }}
        />
      </Skeleton>

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          {club.category && (
            <Badge borderRadius="full" px="2" colorScheme="teal">
              {club.category}
            </Badge>
          )}
        </Box>

        <Heading as="h3" size="md" mt="1" mb="2" color={headingColor}>
          {club.name}
        </Heading>

        {/* Render HTML description safely */}
        <Text
          color={textColor}
          noOfLines={3}
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />

        <Stack mt={4} direction="row" spacing={4} align="center">
          {/* Join/Leave Button */}
          {isJoined ? (
            <Button colorScheme="red" size="sm" onClick={onLeave}>
              Leave
            </Button>
          ) : (
            <Button colorScheme="teal" size="sm" onClick={onJoin}>
              Join
            </Button>
          )}

          {/* View Details Button */}
          <Button
            as={RouterLink}
            to={`/club/${club.id}`}
            colorScheme="teal"
            size="sm"
            rightIcon={<ArrowForwardIcon />}
          >
            View Details
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ClubCard;
