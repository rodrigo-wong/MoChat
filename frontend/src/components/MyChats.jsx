import { Button, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { getSender } from "../config/ChatLogics";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyChats = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const [loggedUser, setLoggedUser] = useState(user);
  //const [loading,setLoading] = useState()
  const toast = useToast();
  const navigate = useNavigate();

  const fetchChats = async () => {
    try {
      await axios("http://localhost:5001/api/chat", {
        headers: {
          authorization: "Bearer " + user.token,
        },
      }).then((res) => setChats(res.data));
      navigate("/chats");
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error fetching chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [selectedChat]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems={"center"}
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth={"1px"}
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          display="flex"
          w={"100%"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          MyChats
          <GroupChatModal>
            <Button
              display={"flex"}
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display={"flex"}
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w={"100%"}
          h={"100%"}
          borderRadius="lg"
          overflow={"hidden"}
        >
          {chats.length > 0 ? (
            <Stack overflowY={"scroll"}>
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
