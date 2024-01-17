import React from "react";
import { Container, Box, Text, Tabs, TabList, Tab,TabPanels, TabPanel } from "@chakra-ui/react";
import Login from '../components/Authentication/Login'
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";

const Homepage = () => {
  const navigate = useNavigate();
  const {setUser} = ChatState()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo)
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="x1" marginStart='25%' marginEnd='25%'>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box display="flex" justifyContent="center">
          <img src="/mochat-logo.svg" alt="logo" style={{width: "30%", minWidth: "200px" }}/>
        </Box>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" color='black'>
        <Tabs variant="soft-rounded">
          <TabList mb='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Sign up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
