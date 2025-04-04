import { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Flex,
  useColorModeValue,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const [addUser, { loading, error }] = useMutation(ADD_USER);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const { data } = await addUser({
        variables: { username, email, password },
      });

      Auth.login(data.addUser.token);
      toast({
        title: "Signup Successful",
        description: `Welcome, ${data.addUser.user.username}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/"); // Redirect to home or desired page
    } catch (error) {
      toast({
        title: "Signup Failed",
        description:
          error.message || "Username might already be taken or invalid input.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const formBg = useColorModeValue("white", "gray.800");

  return (
    <Flex justify="center" align="center" height="100vh" bg={bgColor}>
      <Box
        p={8}
        maxW="md"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg={formBg}
      >
        <Heading mb={6} textAlign="center">
          Signup
        </Heading>
        <form onSubmit={handleSignup}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={loading}
            >
              Signup
            </Button>
            {error && (
              <Text color="red.500">Failed to signup. Please try again.</Text>
            )}
            <Text>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#3182CE" }}>
                Login
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Signup;
