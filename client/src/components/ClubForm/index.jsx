// src/components/Clubs/ClubForm.jsx

import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Image,
  Stack,
  useColorModeValue,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_CLUB, UPDATE_CLUB } from "../../utils/mutations";

const ClubForm = ({ initialData = {}, onSuccess }) => {
  const [formState, setFormState] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    category: initialData.category || "",
    image: initialData.image || "",
  });

  const [createClub, { error: createError }] = useMutation(CREATE_CLUB);
  const [updateClub, { error: updateError }] = useMutation(UPDATE_CLUB);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData._id) {
        const { data } = await updateClub({
          variables: { clubId: initialData._id, ...formState },
        });
        onSuccess(data.updateClub);
      } else {
        const { data } = await createClub({ variables: { ...formState } });
        onSuccess(data.createClub);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const error = createError || updateError;

  return (
    <Box
      p={6}
      boxShadow="md"
      borderRadius="md"
      bg={useColorModeValue("white", "gray.700")}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error.message}
            </Alert>
          )}
          <FormControl id="name" isRequired>
            <FormLabel>Club Name</FormLabel>
            <Input
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Enter club name"
            />
          </FormControl>
          <FormControl id="description" isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Enter club description"
            />
          </FormControl>
          <FormControl id="category" isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              name="category"
              value={formState.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Technology">Technology</option>
              
              {/* Add more categories as needed */}
            </Select>
          </FormControl>
          <FormControl id="image">
            <FormLabel>Image URL</FormLabel>
            <Input
              name="image"
              value={formState.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </FormControl>
          {/* Optionally, add image preview */}
          {formState.image && (
            <Image
              src={formState.image}
              alt="Club Image Preview"
              boxSize="200px"
              objectFit="cover"
              borderRadius="md"
            />
          )}
          <Button type="submit" colorScheme="teal" width="full">
            {initialData._id ? "Update Club" : "Create Club"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ClubForm;
