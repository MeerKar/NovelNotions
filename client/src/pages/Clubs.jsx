import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Flex,
  Heading,
  Container,
  SimpleGrid,
  Button,
  useColorModeValue,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ClubCard from "../components/ClubCard";
import { FaPlus, FaSearch, FaSignOutAlt } from "react-icons/fa";
import AuthService from "../utils/Auth";
import { getCurrentUser } from "../utils/currentUser";

const staticClubData = [
  {
    id: "1",
    name: "Epic Storytellers",
    image:
      "https://i0.wp.com/bhamnow.com/wp-content/uploads/2021/09/IMG_6680.jpeg",
    description:
      "<em>Dive into epic tales and adventurous stories. Join us as we explore fantastical worlds and heroic journeys, perfect for those who love to get lost in a great narrative.</em>",
    category: "Fiction",
  },
  {
    id: "2",
    name: "Realms of Reality",
    image:
      "https://gwinnettpl.libnet.info/images/events/gwinnettpl/Book_Club.jpg",
    description:
      "<em>Engage with non-fiction books that challenge your perspective and deepen your understanding of the world. Ideal for inquisitive minds who enjoy learning and discussing real-life issues.</em>",
    category: "Non-Fiction",
  },
  {
    id: "3",
    name: "Portraits in Prose",
    image:
      "https://www.thoughtco.com/thmb/teoX7PKfpnkClDB212o68dcb4N8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/578193083-56a0ea9b3df78cafdaa65bb1.jpg",
    description:
      "<em>Explore biographical and autobiographical works that offer a glimpse into the lives of fascinating individuals. Perfect for those who love personal stories and historical figures.</em>",
    category: "Biography",
  },
  {
    id: "4",
    name: "Little Page Turners",
    image:
      "https://www.redapplereading.com/blog/wp-content/uploads/02-04-bookclub-blog-1024x683.jpg",
    description:
      "<em>A fun and engaging club for young readers. We dive into children's literature, fostering a love for reading in kids through interactive and exciting book discussions.</em>",
    category: "Kids",
  },
  {
    id: "5",
    name: "Digital Innovators",
    image:
      "https://techcrunch.com/wp-content/uploads/2016/02/book-club-alice-pic.jpg",
    description:
      "<em>Stay ahead of the curve with books on the latest in technology and innovation. Perfect for tech enthusiasts and professionals looking to expand their knowledge and network.</em>",
    category: "Technology",
  },
  {
    id: "6",
    name: "Mystery & Mayhem",
    image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F629219019%2F1819301312103%2F1%2Foriginal.png?h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C940%2C470&s=4f958995e741fb4c5adbd2352bc0a84b",
    description:
      "<em>For those who love suspense and thrillers, this club delves into the best mystery novels. Join us for discussions that will keep you on the edge of your seat.</em>",
    category: "Thriller",
  },
];

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [joinedClubs, setJoinedClubs] = useState([]);
  const toast = useToast();
  const currentUser = useMemo(() => getCurrentUser(), []);

  // Fetch clubs on component mount
  useEffect(() => {
    const fetchClubs = async () => {
      const savedClubs = JSON.parse(localStorage.getItem("clubs")) || [];
      const normalizedSavedClubs = savedClubs.map((club) => ({
        ...club,
        id: club._id || club.id,
      }));
      setClubs([...staticClubData, ...normalizedSavedClubs]);
    };
    fetchClubs();
  }, []);

  // Load user's joined clubs from localStorage
  useEffect(() => {
    if (currentUser) {
      const userJoinedClubs =
        JSON.parse(localStorage.getItem(`joinedClubs_${currentUser.id}`)) || [];
      setJoinedClubs(userJoinedClubs);
    }
  }, [currentUser]);

  // Handle joining a club
  const handleJoinClub = useCallback(
    (clubId) => {
      if (!joinedClubs.includes(clubId)) {
        const updatedJoinedClubs = [...joinedClubs, clubId];
        setJoinedClubs(updatedJoinedClubs);
        localStorage.setItem(
          `joinedClubs_${currentUser.id}`,
          JSON.stringify(updatedJoinedClubs)
        );
        toast({
          title: "Joined Club",
          description: "You have successfully joined the club.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [joinedClubs, currentUser.id, toast]
  );

  // Handle leaving a club
  const handleLeaveClub = useCallback(
    (clubId) => {
      if (joinedClubs.includes(clubId)) {
        const updatedJoinedClubs = joinedClubs.filter((id) => id !== clubId);
        setJoinedClubs(updatedJoinedClubs);
        localStorage.setItem(
          `joinedClubs_${currentUser.id}`,
          JSON.stringify(updatedJoinedClubs)
        );
        toast({
          title: "Left Club",
          description: "You have successfully left the club.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [joinedClubs, currentUser.id, toast]
  );

  // Filter clubs based on the search term
  const filteredClubs = useMemo(
    () =>
      clubs.filter((club) =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [clubs, searchTerm]
  );

  // UI color settings
  const navBgColor = useColorModeValue("#f8ede3", "#1A202C");
  const headingColor = useColorModeValue("gray.800", "white");
  const buttonColorScheme = "teal";
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "white");

  return (
    <Container maxW="container.xl" py={8}>
      {/* Navigation Bar */}
      <Box
        as="nav"
        w="100%"
        p={4}
        mb={8}
        bg={navBgColor}
        borderRadius="md"
        boxShadow="sm"
      >
        <Flex justify="space-between" align="center" flexWrap="wrap">
          <Heading as="h2" size="lg" color={headingColor}>
            Clubs
          </Heading>
          <Flex>
            <Button
              as={Link}
              to="/create-club"
              mr={4}
              colorScheme={buttonColorScheme}
              leftIcon={<FaPlus />}
              variant="solid"
            >
              Create Club
            </Button>
            <Button
              as={Link}
              to="/my-club"
              mr={4}
              colorScheme={buttonColorScheme}
              variant="outline"
            >
              My Club
            </Button>
            <Button
              as={Link}
              to="/my-reads"
              colorScheme={buttonColorScheme}
              variant="outline"
            >
              My Reads
            </Button>
            {currentUser && (
              <Button
                ml={4}
                colorScheme="red"
                variant="ghost"
                onClick={() => AuthService.logout()}
                leftIcon={<FaSignOutAlt />}
              >
                Logout
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Search Bar */}
      <Box mb={8}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.500" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search Clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={inputBg}
            color={inputColor}
            borderRadius="md"
            boxShadow="sm"
            _placeholder={{ color: "gray.400" }}
          />
        </InputGroup>
      </Box>

      {/* Club Cards Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {filteredClubs.length > 0 ? (
          filteredClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              isJoined={joinedClubs.includes(club.id)}
              onJoin={() => handleJoinClub(club.id)}
              onLeave={() => handleLeaveClub(club.id)}
            />
          ))
        ) : (
          <Flex justify="center" align="center" w="100%">
            <Text fontSize="xl" color="gray.500">
              No clubs found matching &quot;{searchTerm}&quot;
            </Text>
          </Flex>
        )}
      </SimpleGrid>

      {/* Footer Button to Create Club */}
      <Flex justify="center" mt={10}>
        <Button
          as={Link}
          to="/create-club"
          colorScheme={buttonColorScheme}
          leftIcon={<FaPlus />}
          size="lg"
        >
          Start a New Club
        </Button>
      </Flex>
    </Container>
  );
};

export default Clubs;
