import React from 'react'
import { useParams } from 'react-router-dom';
import { Container, Box, Center } from '@chakra-ui/react';

const VerificationPage = () => {
    const {status} = useParams();
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
            {status === "sucess"? "Email verified succesfully." : "Failed to verified email."}
          </Center>
        </Box>
      </Container>
    )
}

export default VerificationPage