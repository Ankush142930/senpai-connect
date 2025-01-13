/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { ChatState } from '../../context/chatProvider';
import {
  Box,
  useToast,
  Text,
  IconButton,
  Spinner,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { IoArrowBack } from 'react-icons/io5';
import { getSender, getSenderComplete } from '../../config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateChatModal from './UpdateChatModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import { io } from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../../assets/animations/typing.json';

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSetting: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage('');
        const { data } = await axios.post(
          '/api/message',
          { chatId: selectedChat._id, content: newMessage },
          config
        );

        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Error Occurred!',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //Typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var currTime = new Date().getTime();
      var timeDiff = currTime - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log(notifications, '-----------------------------');

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: 'xl', md: '2xl' }}
            pb={3}
            px={2}
            w={'100%'}
            fontWeight={'bold'}
            fontFamily={'Work Sans'}
            display={'flex'}
            justifyContent={{ base: 'space-between' }}
            alignItems={'center'}
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<IoArrowBack />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderComplete(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'flex-end'}
            w={'full'}
            h={'full'}
            borderRadius={'lg'}
            p={3}
            bg={'#e8e8e8'}
            overflowY={'hidden'}
          >
            {loading ? (
              <Spinner
                size={'xl'}
                w={20}
                h={20}
                alignSelf={'center'}
                margin={'auto '}
                color="orange"
              />
            ) : (
              <Box
                display={'flex '}
                flexDir={'column'}
                overflowY={'scroll'}
                scrollbar={'hidden'}
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={'filled'}
                focusBorderColor="orange.400"
                bg={'orange.200'}
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={'flex'}
          flexDir={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          h={'100%'}
        >
          <img src="./src/assets/logo3.png" alt="logo" width={'100vh'} />
          <Text fontSize={'3xl'} pb={3}>
            Click on a user to start chatting...
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
