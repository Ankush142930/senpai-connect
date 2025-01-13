/* eslint-disable react/prop-types */
import { Avatar, Box, Text } from '@chakra-ui/react';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor={'pointer'}
      bg={'#e8e8e8'}
      w={'100%'}
      display={'flex'}
      alignItems={'center'}
      color={'black'}
      px={3}
      py={2}
      mb={2}
      borderRadius={'lg'}
      _hover={{ background: '#ffc5ac', color: 'white' }}
    >
      <Avatar
        mr={2}
        size={'sm'}
        cursor={'pointer'}
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text fontWeight={'bold'}>{user.name}</Text>
        <Text fontSize={'2xs'}>{user.email}</Text>
      </Box>
    </Box>
  );
};
export default UserListItem;
