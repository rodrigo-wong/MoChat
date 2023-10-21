import React, { useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import { useState } from "react";
import ScrollableChat from "../ScrollableChat";
import io from "socket.io-client";
import "./style.css";
import axios from "axios";

const ENDPOINT = process.env.REACT_APP_API_URL;
var socket, selectedChatCompare;

const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      await axios(process.env.REACT_APP_API_URL+"/api/message/" + selectedChat._id, {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      }).then((res) => setMessages(res.data));
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error fetching messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    if (!socketConnected) {
      socket = io(ENDPOINT);
      socket.on("connected", () => setSocketConnected(true));
      socket.emit("setup", user);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const updateNotif = async (message) => {
    await axios.put(
      process.env.REACT_APP_API_URL+"/api/message/notification",
      {
        chatId: message.chat._id,
        messageId: message._id,
      },
      {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      }
    );
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const message = await axios.post(
          process.env.REACT_APP_API_URL+"api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: {
              Authorization: "Bearer " + user.token,
            },
          }
        );
        //console.log(data);
        socket.emit("new message", message.data);
        setMessages([...messages, message.data]);
        //if(selectedChat._id === data.chat._id)
        //updateNotif(message.data);
      } catch (error) {
        console.log(error.message);
        toast({
          title: "Error sending messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily={"Work sans"}
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                {
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                }
              </>
            ) : (
              <>
                {selectedChat.chatName}
                {<UpdateGroupChatModal fetchMessages={fetchMessages} />}
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir="column"
            justifyContent={"flex-end"}
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius={"lg"}
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size={"x1"}
                w={20}
                h={20}
                alignSelf="center"
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant={"filled"}
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems="center"
          justifyContent={"center"}
          h="100%"
        >
          <Text fontSize={"3x1"} pb={3} fontFamily="Work sans">
            Click on a chat to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
