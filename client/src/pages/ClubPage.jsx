// src/pages/ClubPage.jsx

import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Image,
  Text,
  Badge,
  Button,
  Flex,
  Container,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import AuthService from "../utils/Auth";
import { getCurrentUser } from "../utils/currentUser";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

const ClubPage = () => {
  const { id } = useParams(); // Extract the club ID from the URL
  const [club, setClub] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const toast = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Fetch club data based on ID
    const fetchClub = () => {
      // Retrieve clubs from localStorage or use static data
      const savedClubs = JSON.parse(localStorage.getItem("clubs")) || [];
      // Normalize savedClubs to have 'id' if they use '_id'
      const normalizedSavedClubs = savedClubs.map((club) => ({
        ...club,
        id: club._id || club.id,
      }));

      // Combine with staticClubData if necessary
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

      const allClubs = [...staticClubData, ...normalizedSavedClubs];
      const foundClub = allClubs.find((c) => c.id === id);
      setClub(foundClub);

      // Check if the user has joined this club
      if (currentUser && foundClub) {
        const userJoinedClubs =
          JSON.parse(localStorage.getItem(`joinedClubs_${currentUser.id}`)) ||
          [];
        setIsJoined(userJoinedClubs.includes(foundClub.id));
      }
    };

    fetchClub();
  }, [id, currentUser]);

  const handleJoin = () => {
    if (!isJoined && currentUser) {
      const userJoinedClubs =
        JSON.parse(localStorage.getItem(`joinedClubs_${currentUser.id}`)) || [];
      const updatedJoinedClubs = [...userJoinedClubs, club.id];
      localStorage.setItem(
        `joinedClubs_${currentUser.id}`,
        JSON.stringify(updatedJoinedClubs)
      );
      setIsJoined(true);
      toast({
        title: "Joined Club",
        description: `You have joined ${club.name}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLeave = () => {
    if (isJoined && currentUser) {
      const userJoinedClubs =
        JSON.parse(localStorage.getItem(`joinedClubs_${currentUser.id}`)) || [];
      const updatedJoinedClubs = userJoinedClubs.filter(
        (cId) => cId !== club.id
      );
      localStorage.setItem(
        `joinedClubs_${currentUser.id}`,
        JSON.stringify(updatedJoinedClubs)
      );
      setIsJoined(false);
      toast({
        title: "Left Club",
        description: `You have left ${club.name}.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("teal.600", "teal.300");

  if (!club) {
    return (
      <Flex justify="center" align="center" height="100vh" bg={bgColor}>
        <Text fontSize="xl" color="gray.500">
          Club not found.
        </Text>
      </Flex>
    );
  }

  const sanitizedDescription = DOMPurify.sanitize(club.description);

  return (
    <Container maxW="container.md" py={8}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={cardBg}
        boxShadow="lg"
      >
        <Image
          src={
            club.image || "https://via.placeholder.com/400x200?text=No+Image"
          }
          alt={`${club.name} Image`}
          width="100%"
          height="300px"
          objectFit="cover"
        />

        <Box p="6">
          <Box display="flex" alignItems="baseline">
            {club.category && (
              <Badge borderRadius="full" px="2" colorScheme="teal">
                {club.category}
              </Badge>
            )}
          </Box>

          <Heading as="h2" size="lg" mt="2" mb="4" color={headingColor}>
            {club.name}
          </Heading>

          {/* Render HTML description safely */}
          <Text
            color={textColor}
            mb="4"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />

          {/* Join/Leave Button */}
          {currentUser && (
            <Button
              colorScheme={isJoined ? "red" : "teal"}
              onClick={isJoined ? handleLeave : handleJoin}
            >
              {isJoined ? "Leave Club" : "Join Club"}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ClubPage;
