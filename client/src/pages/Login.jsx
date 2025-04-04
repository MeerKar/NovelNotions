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
import { LOGIN_USER } from "../utils/mutations"; // Adjust path as needed
import Auth from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  // Set up the login mutation with Apollo
  const [login, { loading, error }] = useMutation(LOGIN_USER);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await login({
        variables: { email, password },
      });

      // Assuming AuthService.login() stores the token in local storage
      Auth.login(data.login.token);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.login.user.username}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/"); // Redirect to home or desired page
    } catch (err) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const backgroundImageUrl =
    "https://media.npr.org/assets/img/2020/01/10/book-club-_wide-91bca7f71828ead5630585078e34a30d7e52d8e9.jpg";

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      backgroundImage={`url(${backgroundImageUrl})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="rgba(0, 0, 0, 0.6)"
        zIndex="0"
      />

      <Box
        position="relative"
        p={8}
        maxW="md"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg={useColorModeValue("whiteAlpha.900", "gray.700")}
        zIndex="1"
      >
        <Heading
          mb={6}
          textAlign="center"
          color={useColorModeValue("teal.600", "teal.300")}
        >
          Login
        </Heading>
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg={useColorModeValue("white", "gray.600")}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg={useColorModeValue("white", "gray.600")}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={loading}
            >
              Login
            </Button>
            {error && (
              <Text color="red.500">Failed to login. Please try again.</Text>
            )}
            <Text>
              Don&apos;t have an account?{" "}
              <Link to="/signup" style={{ color: "#3182CE" }}>
                Signup
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
