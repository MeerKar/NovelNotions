import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Container,
  SimpleGrid,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import ClubCard from "../components/ClubCard";
import AuthService from "../utils/Auth";
import DOMPurify from "dompurify";

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
  // ... add other static clubs as needed
];

const MyClub = () => {
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [clubs, setClubs] = useState([]);

  const currentUser = AuthService.loggedIn() ? AuthService.getProfile() : null;

  useEffect(() => {
    const fetchClubs = async () => {
      // Fetch clubs from backend or use static data
      const savedClubs = JSON.parse(localStorage.getItem("clubs")) || [];
      // Normalize savedClubs to have 'id' if they use '_id'
      const normalizedSavedClubs = savedClubs.map((club) => ({
        ...club,
        id: club._id || club.id,
      }));
      setClubs([...staticClubData, ...normalizedSavedClubs]);
    };

    fetchClubs();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const userJoinedClubs =
        JSON.parse(localStorage.getItem(`joinedClubs_${currentUser.id}`)) || [];
      setJoinedClubs(userJoinedClubs);
    }
  }, [currentUser]);

  // Define color schemes based on the current color mode
  const headingColor = useColorModeValue("gray.800", "white");

  // Filter clubs that the user has joined
  const myClubs = clubs.filter((club) => joinedClubs.includes(club.id));

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h2" size="lg" color={headingColor} mb={8}>
        My Clubs
      </Heading>

      {myClubs.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {myClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              isJoined={true}
              // Optionally, you can add a leave handler if needed
            />
          ))}
        </SimpleGrid>
      ) : (
        <Flex justify="center" align="center" w="100%">
          <Text fontSize="xl" color="gray.500">
            You have not joined any clubs yet.
          </Text>
        </Flex>
      )}
    </Container>
  );
};

export default MyClub;
