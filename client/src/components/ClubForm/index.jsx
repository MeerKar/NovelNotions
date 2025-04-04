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
import { useMutation } from "@apollo/client";
import { CREATE_CLUB } from "../../utils/mutations";

const ClubForm = ({ onSuccess }) => {
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
  });
  const toast = useToast();

  const [createClub, { loading, error }] = useMutation(CREATE_CLUB, {
    onCompleted: (data) => {
      toast({
        title: "Club Created",
        description: `Your club "${data.createClub.name}" has been successfully created!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess(data.createClub);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClub({
        variables: { ...formState },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Club Name</FormLabel>
          <Input
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder="Enter club name"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            placeholder="Enter club description"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Category</FormLabel>
          <Select
            name="category"
            value={formState.category}
            onChange={handleChange}
            placeholder="Select category"
          >
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Biography">Biography</option>
            <option value="Kids">Kids</option>
            <option value="Technology">Technology</option>
            <option value="Thriller">Thriller</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Image URL (optional)</FormLabel>
          <Input
            name="image"
            value={formState.image}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          isLoading={loading}
          loadingText="Creating..."
        >
          Create Club
        </Button>
      </Stack>
    </Box>
  );
};

export default ClubForm;
