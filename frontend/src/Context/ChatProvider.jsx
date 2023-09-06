import React from 'react'
import { useState } from 'react';
import { createContext , useContext} from 'react'

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [selectedChat, setSelectedChat] = useState();
    const [user, setUser] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([])

  return (
    <ChatContext.Provider value = {{user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification}}>{children}</ChatContext.Provider>
  )
}

export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider