import { useState } from "react";
import {
  Box,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Image,
} from "@chakra-ui/react";

const CreateClub = () => {
  const [name, setName] = useState(""); // Updated key to 'name'
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    const clubs = JSON.parse(localStorage.getItem("clubs")) || [];
    const newClub = { name, description, image }; // Use 'name' instead of 'clubName'
    localStorage.setItem("clubs", JSON.stringify([...clubs, newClub]));

    toast({
      title: "Club created.",
      description: `You have successfully created the ${name} club.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    setName(""); // Reset the 'name' state
    setDescription("");
    setImage("");
  };

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh">
      <Box p={6} boxShadow="md" borderRadius="md" w="100%" maxW="md">
        <Heading mb={6}>Create Club</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="name" mb={4} isRequired>
            {" "}
            {/* Updated 'clubName' to 'name' */}
            <FormLabel>Club Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl id="description" mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl id="image" mb={4}>
            <FormLabel>Image URL</FormLabel>
            <Input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Enter image URL"
            />
            {image && (
              <Image
                src={image}
                alt="Club Image Preview"
                mt={4}
                borderRadius="md"
              />
            )}
          </FormControl>
          <Button type="submit" colorScheme="orange" w="full">
            Create Club
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default CreateClub;
