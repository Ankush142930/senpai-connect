/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ChatState } from '../context/chatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/miscellaneous/ChatBox';

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState();

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        columnGap={'10px'}
        w={'100%'}
        h={'90vh'}
        p={'10px'}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};
export default ChatPage;
