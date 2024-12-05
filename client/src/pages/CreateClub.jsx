import { useNavigate } from "react-router-dom";
import { Container, Heading, Box, useColorModeValue, useToast } from "@chakra-ui/react";
import ClubForm from "../components/ClubForm";

const CreateClubPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSuccess = (newClub) => {
    toast({
      title: "Club Created",
      description: `Your club "${newClub.name}" has been successfully created!`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate(`/clubs/${newClub.id}`);
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
