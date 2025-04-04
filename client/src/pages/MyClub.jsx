import { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Container,
  SimpleGrid,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import ClubCard from "../components/ClubCard";
import Auth from "../utils/auth";

const staticClubData = [
  {
    id: "1",
    name: "Epic Storytellers",
    image:
      "https://i0.wp.com/bhamnow.com/wp-content/uploads/2021/09/IMG_6680.jpeg",
    description:
      "Dive into epic tales and adventurous stories. Join us as we explore fantastical worlds and heroic journeys, perfect for those who love to get lost in a great narrative.",
    category: "Fiction",
  },
  {
    id: "2",
    name: "Realms of Reality",
    image:
      "https://gwinnettpl.libnet.info/images/events/gwinnettpl/Book_Club.jpg",
    description:
      "Engage with non-fiction books that challenge your perspective and deepen your understanding of the world. Ideal for inquisitive minds who enjoy learning and discussing real-life issues.",
    category: "Non-Fiction",
  },
  {
    id: "3",
    name: "Portraits in Prose",
    image:
      "https://www.thoughtco.com/thmb/teoX7PKfpnkClDB212o68dcb4N8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/578193083-56a0ea9b3df78cafdaa65bb1.jpg",
    description:
      "Explore biographical and autobiographical works that offer a glimpse into the lives of fascinating individuals. Perfect for those who love personal stories and historical figures.",
    category: "Biography",
  },
  {
    id: "4",
    name: "Little Page Turners",
    image:
      "https://www.redapplereading.com/blog/wp-content/uploads/02-04-bookclub-blog-1024x683.jpg",
    description:
      "A fun and engaging club for young readers. We dive into children's literature, fostering a love for reading in kids through interactive and exciting book discussions.",
    category: "Kids",
  },
  {
    id: "5",
    name: "Digital Innovators",
    image:
      "https://techcrunch.com/wp-content/uploads/2016/02/book-club-alice-pic.jpg",
    description:
      "Stay ahead of the curve with books on the latest in technology and innovation. Perfect for tech enthusiasts and professionals looking to expand their knowledge and network.",
    category: "Technology",
  },
  {
    id: "6",
    name: "Mystery & Mayhem",
    image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F629219019%2F1819301312103%2F1%2Foriginal.png?h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C940%2C470&s=4f958995e741fb4c5adbd2352bc0a84b",
    description:
      "For those who love suspense and thrillers, this club delves into the best mystery novels. Join us for discussions that will keep you on the edge of your seat.",
    category: "Thriller",
  },
];

const MyClub = () => {
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [allClubs, setAllClubs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Track current user state

  useEffect(() => {
    // Fetch current user from Auth
    const user = Auth.loggedIn() ? Auth.getProfile() : null;
    setCurrentUser(user); // Set the user once
  }, []); // Only runs once on mount

  useEffect(() => {
    // Fetch all clubs (static + saved)
    const fetchClubs = () => {
      const savedClubs = JSON.parse(localStorage.getItem("clubs")) || [];
      const normalizedClubs = savedClubs.map((club) => ({
        ...club,
        id: club._id || club.id,
      }));
      setAllClubs([...staticClubData, ...normalizedClubs]);
    };

    fetchClubs();
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    // Fetch joined clubs for the current user
    if (currentUser) {
      const userJoinedClubs =
        JSON.parse(localStorage.getItem(`joinedClubs_${currentUser.id}`)) || [];
      setJoinedClubs(userJoinedClubs);
    }
  }, [currentUser]); // Runs only when `currentUser` changes

  // Filter the clubs that the user has joined
  const myClubs = allClubs.filter((club) => joinedClubs.includes(club.id));

  const headingColor = useColorModeValue("gray.800", "white");

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h2" size="lg" color={headingColor} mb={8}>
        My Clubs
      </Heading>

      {myClubs.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {myClubs.map((club) => (
            <ClubCard key={club.id} club={club} isJoined={true} />
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
