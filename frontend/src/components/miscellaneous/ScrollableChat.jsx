/* eslint-disable react/prop-types */
import { Avatar, Box, Tooltip } from '@chakra-ui/react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../../config/ChatLogics';
import { ChatState } from '../../context/chatProvider';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          return (
            <Box display={'flex'} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt={'7px'}
                    mr={1}
                    size={'sm'}
                    cursor={'pointer'}
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}

              <Box
                borderRadius={'md'}
                p={'5px 15px'}
                maxW={'75%'}
                bg={m.sender._id === user._id ? 'blue.100' : 'green.100'}
                ml={isSameSenderMargin(messages, m, i, user._id)}
                mb={isSameUser(messages, m, i) ? '3px' : '10px'}
              >
                {m.content}
              </Box>
            </Box>
          );
        })}
    </ScrollableFeed>
  );
};
export default ScrollableChat;
