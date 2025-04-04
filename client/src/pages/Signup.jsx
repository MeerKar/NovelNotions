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
import Auth from "../utils/auth";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        // Replace with your backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, name, email }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const data = await response.json();
      Auth.login(data.token);
      toast({
        title: "Signup Successful",
        description: `Welcome, ${Auth.getProfile().name}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/"); // Redirect to home or desired page
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Username might already be taken or invalid input.",
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
            <FormControl id="name" isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
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
            <Button type="submit" colorScheme="teal" width="full">
              Signup
            </Button>
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
