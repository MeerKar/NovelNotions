import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Stack,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

const ClubForm = ({ onSuccess }) => {
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
  });
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Retrieve existing clubs from localStorage
      const existingClubs = JSON.parse(localStorage.getItem("clubs")) || [];
      // Add a unique ID to the new club
      const newClub = { ...formState, id: Date.now() };
      // Save the new club
      localStorage.setItem("clubs", JSON.stringify([...existingClubs, newClub]));

      toast({
        title: "Club Created",
        description: `Your club "${newClub.name}" has been successfully created!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Call the success callback
      onSuccess(newClub);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An error occurred while creating the club.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl id="name" isRequired>
          <FormLabel>Club Name</FormLabel>
          <Input
            name="name"
            placeholder="Enter club name"
            value={formState.name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="description" isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            placeholder="Enter club description"
            value={formState.description}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="category" isRequired>
          <FormLabel>Category</FormLabel>
          <Select
            name="category"
            placeholder="Select category"
            value={formState.category}
            onChange={handleChange}
          >
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Technology">Technology</option>
            <option value="Biography">Biography</option>
            <option value="Kids">Kids</option>
            <option value="Thriller">Thriller</option>
            <option value="Pet Club">Pet Club</option>
          </Select>
        </FormControl>
        <FormControl id="image">
          <FormLabel>Image URL</FormLabel>
          <Input
            name="image"
            placeholder="Enter image URL"
            value={formState.image}
            onChange={handleChange}
          />
        </FormControl>
        <Button type="submit" colorScheme="teal">
          Create Club
        </Button>
      </Stack>
    </Box>
  );
};

export default ClubForm;
