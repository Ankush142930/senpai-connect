/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { ChatState } from '../../context/chatProvider';
import { Box, Button, Divider, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { IoMdAdd } from 'react-icons/io';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/chat', config);
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to load the chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir={'column'}
      alignItems={'center'}
      p={3}
      bg="rgba(254,235,200,0.5)"
      w={{ base: '100%', md: '40%' }}
      borderRadius={'lg'}
      borderWidth={'2px'}
    >
      <Box
        pb={3}
        px={3}
        fontWeight={'semibold'}
        display={'flex'}
        w={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Text fontSize={{ base: 'xl', md: '2xl' }} justifySelf={'center'}>
          My Chats
        </Text>

        <GroupChatModal>
          <Button
            display={'flex'}
            fontSize={'xs'}
            size={'xs'}
            colorScheme="orange"
            rightIcon={<IoMdAdd color="white" />}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Divider borderColor={'orange.600'} borderWidth={'1px'} />

      <Box
        display={'flex'}
        flexDir={'column'}
        p={3}
        w={'100%'}
        h={'100%'}
        borderRadius={'lg'}
        overflow={'hidden'}
      >
        {chats ? (
          <Stack overflowY={'scroll'}>
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor={'pointer'}
                  bg={selectedChat === chat ? 'orange.500' : '#e8e8e8'}
                  _hover={{ background: '#ffa762', color: 'white' }}
                  color={selectedChat === chat ? 'white' : 'black'}
                  px={3}
                  py={2}
                  borderRadius={'lg'}
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};
export default MyChats;
