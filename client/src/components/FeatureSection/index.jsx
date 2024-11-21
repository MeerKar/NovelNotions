// src/components/FeatureSection/index.jsx

import {
  Box,
  Heading,
  SimpleGrid,
  Image,
  Text,
  Button,
  Card,
  CardBody,
  CardFooter,
  useColorModeValue,
  Spinner,
  Center,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchBestSellers } from "../API"; // Ensure this path is correct
import { FaArrowRight, FaStar, FaRegStar } from "react-icons/fa";

const features = [
  {
    title: "Get Your Club Organized",
    description:
      "Manage your book club efficiently with our easy-to-use tools. Keep track of your reading lists, schedule meetings, and engage with your members all in one place.",
    image:
      "https://www.rd.com/wp-content/uploads/2022/11/GettyImages-1389876065.jpg",
    link: "/clubs",
    buttonText: "Organize Now",
  },
  {
    title: "Find a Club to Join",
    description:
      "Looking to join a book club? Discover a variety of clubs that match your reading interests and connect with like-minded readers.",
    image: "https://www.pbc.guru/images/pbc-guru-managed-book-clubs-home.jpg",
    link: "/join-club",
    buttonText: "Join a Club",
  },
  {
    title: "Discover New Books",
    description:
      "Explore our curated selection of books and find your next great read. Whether you love fiction, non-fiction, or anything in between, we've got something for everyone.",
    image:
      "https://s26162.pcdn.co/wp-content/uploads/2017/08/reading-together.jpg",
    link: "/books",
    buttonText: "Explore Books",
  },
];

const FeatureSection = () => {
  const [bestSellers, setBestSellers] = useState({
    fiction: null,
    nonFiction: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Define color schemes based on the current color mode
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const buttonBg = useColorModeValue("teal.400", "teal.600");
  const buttonHoverColor = useColorModeValue("teal.500", "teal.500");
  const starColor = useColorModeValue("yellow.400", "yellow.300");

  useEffect(() => {
    const getBestSellers = async () => {
      try {
        const [fictionBestSellers, nonFictionBestSellers] = await Promise.all([
          fetchBestSellers("hardcover-fiction"),
          fetchBestSellers("hardcover-nonfiction"),
        ]);

        setBestSellers({
          fiction: fictionBestSellers[0], // Get the first book from the fiction bestsellers list
          nonFiction: nonFictionBestSellers[0], // Get the first book from the non-fiction bestsellers list
        });
      } catch (err) {
        setError(err.message || "Failed to fetch best sellers.");
      } finally {
        setLoading(false);
      }
    };

    getBestSellers();
  }, []);

  // Function to render star ratings (placeholder implementation)
  const renderStars = (rating) => {
    const stars = [];
    const maxStars = 5;
    const filledStars = Math.round(rating);
    for (let i = 1; i <= maxStars; i++) {
      if (i <= filledStars) {
        stars.push(<FaStar key={i} color={starColor} />);
      } else {
        stars.push(<FaRegStar key={i} color={starColor} />);
      }
    }
    return stars;
  };

  return (
    <Box bg={bgColor} py={16} px={{ base: 4, md: 8 }}>
      {/* Features Grid */}
      <Heading
        as="h2"
        size="xl"
        textAlign="center"
        mb={12}
        color={headingColor}
        fontWeight="bold"
      >
        Our Features
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {features.map((feature, index) => (
          <Card
            key={index}
            bg={cardBg}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            _hover={{
              boxShadow: "xl",
              transform: "translateY(-5px)",
              transition: "all 0.3s ease-in-out",
            }}
            transition="all 0.3s ease-in-out"
          >
            <Box position="relative" height="200px" overflow="hidden">
              <Image
                src={feature.image}
                alt={feature.title}
                objectFit="cover"
                width="100%"
                height="100%"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
              />
            </Box>
            <CardBody>
              <Heading as="h3" size="md" mb={4} color={headingColor}>
                {feature.title}
              </Heading>
              <Text color={textColor} mb={4}>
                {feature.description}
              </Text>
            </CardBody>
            <CardFooter>
              <Tooltip
                label={feature.buttonText}
                aria-label={`${feature.buttonText} Tooltip`}
                hasArrow
              >
                <Button
                  as={RouterLink}
                  to={feature.link}
                  rightIcon={<FaArrowRight />}
                  colorScheme="teal"
                  variant="solid"
                  size="md"
                  bg={buttonBg}
                  _hover={{ bg: buttonHoverColor }}
                  width="full"
                >
                  {feature.buttonText}
                </Button>
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      {/* Best Sellers Section */}
      <Box mt={20}>
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={12}
          color={headingColor}
          fontWeight="bold"
        >
          Current Best Sellers
        </Heading>
        {loading ? (
          <Center>
            <Spinner size="xl" color="teal.500" />
          </Center>
        ) : error ? (
          <Center>
            <Text color="red.500" fontSize="lg">
              {error}
            </Text>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            {/* Fiction Best Seller */}
            {bestSellers.fiction && (
              <Card
                bg={cardBg}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                _hover={{
                  boxShadow: "xl",
                  transform: "translateY(-5px)",
                  transition: "all 0.3s ease-in-out",
                }}
                transition="all 0.3s ease-in-out"
              >
                <Box position="relative" height="300px" overflow="hidden">
                  <Image
                    src={bestSellers.fiction.book_image}
                    alt={bestSellers.fiction.title}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                    transition="transform 0.3s ease"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                </Box>
                <CardBody>
                  <Heading as="h3" size="lg" mb={2} color={headingColor}>
                    Fiction
                  </Heading>
                  <Heading as="h4" size="md" mb={2}>
                    {bestSellers.fiction.title}
                  </Heading>
                  <Text fontStyle="italic" mb={2} color={textColor}>
                    {bestSellers.fiction.description}
                  </Text>
                  {/* Placeholder for rating */}
                  <Box display="flex" alignItems="center" mb={2}>
                    {renderStars(4.5)} {/* Example rating */}
                    <Text ml={2} color={textColor}>
                      4.5/5
                    </Text>
                  </Box>
                  <Text mb={2} color={textColor}>
                    <strong>Author:</strong> {bestSellers.fiction.author}
                  </Text>
                </CardBody>
                <CardFooter>
                  <Tooltip
                    label="View Fiction Book"
                    aria-label="View Fiction Book Tooltip"
                    hasArrow
                  >
                    <Button
                      as={RouterLink}
                      to={`/books/${bestSellers.fiction.primary_isbn10}`}
                      colorScheme="teal"
                      variant="outline"
                      size="md"
                      leftIcon={<FaArrowRight />}
                      width="full"
                    >
                      View Book
                    </Button>
                  </Tooltip>
                </CardFooter>
              </Card>
            )}

            {/* Non-Fiction Best Seller */}
            {bestSellers.nonFiction && (
              <Card
                bg={cardBg}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                _hover={{
                  boxShadow: "xl",
                  transform: "translateY(-5px)",
                  transition: "all 0.3s ease-in-out",
                }}
                transition="all 0.3s ease-in-out"
              >
                <Box position="relative" height="300px" overflow="hidden">
                  <Image
                    src={bestSellers.nonFiction.book_image}
                    alt={bestSellers.nonFiction.title}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                    transition="transform 0.3s ease"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                </Box>
                <CardBody>
                  <Heading as="h3" size="lg" mb={2} color={headingColor}>
                    Non-Fiction
                  </Heading>
                  <Heading as="h4" size="md" mb={2}>
                    {bestSellers.nonFiction.title}
                  </Heading>
                  <Text fontStyle="italic" mb={2} color={textColor}>
                    {bestSellers.nonFiction.description}
                  </Text>
                  {/* Placeholder for rating */}
                  <Box display="flex" alignItems="center" mb={2}>
                    {renderStars(4)} {/* Example rating */}
                    <Text ml={2} color={textColor}>
                      4/5
                    </Text>
                  </Box>
                  <Text mb={2} color={textColor}>
                    <strong>Author:</strong> {bestSellers.nonFiction.author}
                  </Text>
                </CardBody>
                <CardFooter>
                  <Tooltip
                    label="View Non-Fiction Book"
                    aria-label="View Non-Fiction Book Tooltip"
                    hasArrow
                  >
                    <Button
                      as={RouterLink}
                      to={`/books/${bestSellers.nonFiction.primary_isbn10}`}
                      colorScheme="teal"
                      variant="outline"
                      size="md"
                      leftIcon={<FaArrowRight />}
                      width="full"
                    >
                      View Book
                    </Button>
                  </Tooltip>
                </CardFooter>
              </Card>
            )}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};

export default FeatureSection;
