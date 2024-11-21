// src/components/Clubs/JoinClubButton.jsx

import { Button, Alert, AlertIcon } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { JOIN_CLUB, LEAVE_CLUB } from "../../utils/mutations";

const JoinClubButton = ({ clubId, isMember }) => {
  const [joinClub, { loading: joinLoading, error: joinError }] =
    useMutation(JOIN_CLUB);
  const [leaveClub, { loading: leaveLoading, error: leaveError }] =
    useMutation(LEAVE_CLUB);

  const handleJoin = async () => {
    try {
      await joinClub({ variables: { clubId } });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveClub({ variables: { clubId } });
    } catch (err) {
      console.error(err);
    }
  };

  if (joinError || leaveError) {
    return (
      <Alert status="error" mt={4} borderRadius="md">
        <AlertIcon />
        {joinError?.message || leaveError?.message}
      </Alert>
    );
  }

  if (isMember) {
    return (
      <Button colorScheme="red" onClick={handleLeave} isLoading={leaveLoading}>
        Leave Club
      </Button>
    );
  }

  return (
    <Button colorScheme="teal" onClick={handleJoin} isLoading={joinLoading}>
      Join Club
    </Button>
  );
};

export default JoinClubButton;
