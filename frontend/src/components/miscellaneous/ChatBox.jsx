/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ChatState } from '../../context/chatProvider';
import { Box, useToast } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      flexDir={'column'}
      alignItems={'center'}
      p={3}
      bg={'rgba(254,235,200,0.5)'}
      w={{ base: '100%', md: '90%' }}
      borderRadius={'lg'}
      borderWidth={'2px'}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};
export default ChatBox;
