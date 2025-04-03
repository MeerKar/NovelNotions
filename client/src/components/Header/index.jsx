// src/components/Header.jsx

import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Link,
  Spacer,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  useColorModeValue,
  useBreakpointValue,
  Avatar,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  HamburgerIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import {
  FaBook,
  FaUserFriends,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  // FaUser,
} from "react-icons/fa";
import Auth from "../../utils/auth";

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();
  const isLoggedIn = Auth.loggedIn();

  const logout = () => {
    Auth.logout();
  };

  // Determine if the device is mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Styling based on color mode
  const bgColor = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const linkColor = useColorModeValue("gray.700", "gray.200");
  const linkHoverColor = useColorModeValue("teal.500", "teal.300");

  return (
    <Box
      bg={bgColor}
      px={4}
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        {/* Logo and Brand Name */}
        <Flex alignItems="center">
          <RouterLink to="/">
            <Box display="flex" alignItems="center">
              <img
                src="https://cdn.mos.cms.futurecdn.net/eaHcUAyr5ZWH7Su96Caka9-320-80.jpg"
                alt="Readers Den Logo"
                style={{ width: "50px", height: "auto", marginRight: "8px" }}
              />
              <Heading
                size="md"
                fontWeight="bold"
                fontStyle="bolder"
                color={headingColor}
                _hover={{ textDecoration: "none", color: "teal.500" }}
              >
                NovelNotions
              </Heading>
            </Box>
          </RouterLink>
        </Flex>

        {/* Spacer to push navigation to the right */}
        <Spacer />

        {/* Navigation Links */}
        {isLoggedIn ? (
          <Flex alignItems="center">
            {/* Desktop Navigation */}
            {!isMobile && (
              <>
                <Tooltip label="Clubs" aria-label="Clubs">
                  <Link
                    as={RouterLink}
                    to="/clubs"
                    mx={2}
                    color={linkColor}
                    fontWeight="medium"
                    _hover={{ textDecoration: "none", color: linkHoverColor }}
                  >
                    <Flex alignItems="center">
                      <FaUserFriends style={{ marginRight: "4px" }} />
                      Clubs
                    </Flex>
                  </Link>
                </Tooltip>
                <Tooltip label="Browse Books" aria-label="Browse Books">
                  <Link
                    as={RouterLink}
                    to="/books"
                    mx={2}
                    color={linkColor}
                    fontWeight="medium"
                    _hover={{ textDecoration: "none", color: linkHoverColor }}
                  >
                    <Flex alignItems="center">
                      <FaBook style={{ marginRight: "4px" }} />
                      Books
                    </Flex>
                  </Link>
                </Tooltip>
                <Tooltip label="View Your Reads" aria-label="View Your Reads">
                  <Link
                    as={RouterLink}
                    to="/my-reads"
                    mx={2}
                    color={linkColor}
                    fontWeight="medium"
                    _hover={{ textDecoration: "none", color: linkHoverColor }}
                  >
                    Tales Collected
                  </Link>
                </Tooltip>
              </>
            )}

            {/* User Menu */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
                ml={2}
                _hover={{ bg: "gray.100", color: "gray.700" }}
                aria-label="User Menu"
              >
                <Flex alignItems="center">
                  <Avatar
                    size="sm"
                    name="User"
                    src="https://bit.ly/broken-link" // Replace with user's avatar if available
                    mr={2}
                  />
                  {!isMobile && "Account"}
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem as={RouterLink} to="/settings">
                  Settings
                </MenuItem>
                <MenuItem onClick={logout}>
                  <Flex alignItems="center">
                    <FaSignOutAlt style={{ marginRight: "8px" }} />
                    Logout
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ) : (
          <Flex alignItems="center">
            {/* Desktop Navigation */}
            {!isMobile && (
              <>
                <Tooltip label="Join a Book Club" aria-label="Join a Book Club">
                  <Link
                    as={RouterLink}
                    to="/clubs"
                    mx={2}
                    color={linkColor}
                    fontWeight="medium"
                    _hover={{ textDecoration: "none", color: linkHoverColor }}
                  >
                    <Flex alignItems="center">
                      <FaUserFriends style={{ marginRight: "4px" }} />
                      Join a Book Club
                    </Flex>
                  </Link>
                </Tooltip>
                <Tooltip label="Browse Books" aria-label="Browse Books">
                  <Link
                    as={RouterLink}
                    to="/books"
                    mx={2}
                    color={linkColor}
                    fontWeight="medium"
                    _hover={{ textDecoration: "none", color: linkHoverColor }}
                  >
                    <Flex alignItems="center">
                      <FaBook style={{ marginRight: "4px" }} />
                      Books
                    </Flex>
                  </Link>
                </Tooltip>
                <Tooltip label="View Your Reads" aria-label="View Your Reads">
                  <Link
                    as={RouterLink}
                    to="/my-reads"
                    mx={2}
                    color={linkColor}
                    fontWeight="medium"
                    _hover={{ textDecoration: "none", color: linkHoverColor }}
                  >
                    My Reads
                  </Link>
                </Tooltip>
              </>
            )}

            {/* Mobile Navigation */}
            {isMobile && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<ChevronDownIcon />}
                  variant="outline"
                  colorScheme="teal"
                  ml={2}
                  aria-label="Navigation Menu"
                />
                <MenuList>
                  <MenuItem as={RouterLink} to="/clubs">
                    <Flex alignItems="center">
                      <FaUserFriends style={{ marginRight: "8px" }} />
                      Join a Book Club
                    </Flex>
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/books">
                    <Flex alignItems="center">
                      <FaBook style={{ marginRight: "8px" }} />
                      Books
                    </Flex>
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/my-reads">
                    My Reads
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/login">
                    <Flex alignItems="center">
                      <FaSignInAlt style={{ marginRight: "8px" }} />
                      Log In
                    </Flex>
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/signup">
                    <Flex alignItems="center">
                      <FaUserPlus style={{ marginRight: "8px" }} />
                      Sign Up
                    </Flex>
                  </MenuItem>
                </MenuList>
              </Menu>
            )}

            {/* Auth Buttons for Desktop */}
            {!isMobile && (
              <>
                <Tooltip label="Log In" aria-label="Log In">
                  <Link
                    as={RouterLink}
                    to="/login"
                    mx={2}
                    color={linkColor}
                    fontWeight="medium"
                    _hover={{ textDecoration: "none", color: linkHoverColor }}
                  >
                    <Flex alignItems="center">
                      <FaSignInAlt style={{ marginRight: "4px" }} />
                      Log In
                    </Flex>
                  </Link>
                </Tooltip>
                <Tooltip label="Sign Up" aria-label="Sign Up">
                  <Button
                    as={RouterLink}
                    to="/signup"
                    colorScheme="orange"
                    variant="solid"
                    fontWeight="medium"
                    leftIcon={<FaUserPlus />}
                    _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
                  >
                    Sign Up
                  </Button>
                </Tooltip>
              </>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
