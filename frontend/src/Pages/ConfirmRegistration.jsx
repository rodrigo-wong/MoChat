import React from "react";
import { Container, Box, Button, Center } from "@chakra-ui/react";
import { useNavigate} from "react-router-dom";

const ConfirmRegistration = () => {
  const navigate = useNavigate();
  return (
    <Container maxW="x1" marginStart="25%" marginEnd="25%" marginTop="5%">
      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        color="black"
      >
        <Center>
          Succesfully registered. An verification email has been sent. Please verify your email.
        </Center>
      </Box>
      <Center margin={10}>
        <Button onClick={() => navigate("/")}>Home Page</Button>
      </Center>
    </Container>
  );
};

export default ConfirmRegistration;
