import React, { useState } from "react";
import {
  Box,
  Text,
  FormControl,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  Input,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import { useNavigate } from "react-router-dom";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const { user, chats, setChats, setSelectedChat } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const results = await axios(
        "http://localhost:5001/api/user?search=" + search,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      setSearchResult(results.data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search results",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      await axios
        .post(
          "http://localhost:5001/api/chat/group",
          {
            name: groupChatName,
            users: selectedUsers,
          },
          {
            headers: {
              Authorization: "Bearer " + user.token,
            },
          }
        )
        .then((res) => {
          setChats([res.data,...chats])
          setSelectedChat(res.data);
        });
      onClose();
      navigate("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error creating chat",
        status: "error",
        description: error.message,
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: user.name + " has already been added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          fontSize={"35px"}
          fontFamily="Work sans"
          display={"flex"}
          justifyContent="center"
        >
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir="column"
            alignItems="center"
            fontSize={"sm"}
          >
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Input
                placeholder="Add Users (eg: John, Gabi)"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* {selectedUsers.map((user)=> <Text>{user.name}</Text>)} */}
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
