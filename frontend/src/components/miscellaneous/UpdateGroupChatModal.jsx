import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  useDisclosure,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (search) => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }

    try {
      setLoading(true);
      await axios("http://localhost:5001/api/user?search=" + search, {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      }).then((res) => setSearchResult(res.data));
      setLoading(false);
      //console.log(searchResult);
    } catch (err) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already in the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add users to the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      await axios
        .put(
          "http://localhost:5001/api/chat/groupadd",
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          {
            headers: {
              Authorization: "Bearer " + user.token,
            },
          }
        )
        .then((res) => setSelectedChat(res.data));
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        description: error.message,
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove users from the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      await axios
        .put(
          "http://localhost:5001/api/chat/groupremove",
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          {
            headers: {
              Authorization: "Bearer " + user.token,
            },
          }
        )
        .then((res) => {
          user1._id === user._id
            ? setSelectedChat("")
            : setSelectedChat(res.data);
        });

      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        description: error.message,
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const data = await axios
        .put(
          "http://localhost:5001/api/chat/rename",
          {
            chatId: selectedChat._id,
            chatName: groupChatName,
          },
          {
            headers: {
              Authorization: "Bearer " + user.token,
            },
          }
        )
        .then((res) => setSelectedChat(res.data));
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        description: error.message,
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setRenameLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily="Work sans"
            display={"flex"}
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display="flex" flexWrap={"wrap"} pb={3}>
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display={"flex"}>
              <Input
                placeholder="Add users to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
