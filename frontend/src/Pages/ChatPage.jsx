import React from 'react';
import { useEffect } from 'react';
import {ChatState} from '../Context/ChatProvider'
import { useNavigate } from 'react-router-dom';
import {Box} from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { useState } from 'react';

const ChatPage = () => {

  const {user,setUser,setNotification} = ChatState();
  const navigate = useNavigate();


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo)
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate] );
  return (

    <div style ={{width: "100%"}}>
      {user && <SideDrawer/>}
      <Box
        display = 'flex'
        justifyContent='space-between'
        w='100%'
        h='91.5vh'
        p='10px'

      >
      {user && <MyChats/>}
      {user && <ChatBox/>}
      </Box>
    </div>
  )
}

export default ChatPage