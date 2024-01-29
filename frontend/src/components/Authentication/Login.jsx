import { VStack } from "@chakra-ui/layout";
import React, { useState } from "react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { Spinner } from '@chakra-ui/react';
import axios from "axios";

const Login = () => {
  const {user, setUser, setSelectedChat} = ChatState();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate("/chats");

  const handleClick = () => {
    setShow(!show);
  };

  const submitHandler = async () => {
    try {
      if (!email || !password) {
        toast({
          title: "Please Fill all the Fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      setLoading(true);
      const data = await axios
        .post(process.env.REACT_APP_API_URL+"/api/user/login", {
          email: email,
          password: password,
        })
        .then((res) =>
          localStorage.setItem("userInfo", JSON.stringify(res.data))
        )
      navigate("/chats");
      setUser(data.data);
      toast({
        title: "Welcome to Chat-App",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    } catch (error) {
      const status = error.response.status;
      var message = error.message;
      if (status === 404) message = "Email is not associated with an account";
      if (status === 401) message = "Email and password does not match";
      if (status === 403) message = "Email not verified";
      toast({
        title: "Error Occured!",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <div style={{position: "absolute", textAlign: "center"}}>
        {loading? 
          <div>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
            <p>
            Server is being rebooted. This will take 1-2 minutes.
            </p>
            
          </div>
          :
          ""
        }
      </div>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement>
            <Button h="1.75em" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme={"blue"}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        variant={"solid"}
        colorScheme="red"
        width={"100%"}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("guest");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
