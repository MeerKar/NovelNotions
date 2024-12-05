import { Button, Alert, AlertIcon } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { JOIN_CLUB, LEAVE_CLUB } from "../../utils/mutations";

const JoinClubButton = ({ clubId, isMember }) => {
  const navigate = useNavigate();

  const [joinClub, { loading: joinLoading, error: joinError }] = useMutation(
    JOIN_CLUB,
    {
      onCompleted: () => {
        // Navigate to My Clubs after successfully joining
        navigate("/my-clubs");
      },
      onError: (err) => {
        console.error("Error joining club:", err);
      },
    }
  );

  const [leaveClub, { loading: leaveLoading, error: leaveError }] = useMutation(
    LEAVE_CLUB,
    {
      onCompleted: () => {
        // Optionally refresh the page or perform another action after leaving
        console.log("Successfully left the club");
      },
      onError: (err) => {
        console.error("Error leaving club:", err);
      },
    }
  );

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

  return isMember ? (
    <Button colorScheme="red" onClick={handleLeave} isLoading={leaveLoading}>
      Leave Club
    </Button>
  ) : (
    <Button colorScheme="teal" onClick={handleJoin} isLoading={joinLoading}>
      Join Club
    </Button>
  );
};

export default JoinClubButton;
