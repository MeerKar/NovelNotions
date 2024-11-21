// src/pages/CreateClubPage.jsx

import { useNavigate } from "react-router-dom";
import { Container, Heading, Box, useColorModeValue } from "@chakra-ui/react";
import ClubForm from "../components/ClubForm";

const CreateClubPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (newClub) => {
    // Optionally, display a success message or navigate to the new club's detail page
    navigate(`/clubs/${newClub._id}`);
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box
        p={6}
        boxShadow="lg"
        borderRadius="md"
        bg={useColorModeValue("white", "gray.700")}
      >
        <Heading
          as="h2"
          size="lg"
          mb={6}
          textAlign="center"
          color={useColorModeValue("teal.600", "teal.300")}
        >
          Create a New Club
        </Heading>
        <ClubForm onSuccess={handleSuccess} />
      </Box>
    </Container>
  );
};

export default CreateClubPage;
