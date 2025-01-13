/* eslint-disable react/prop-types */
import { Badge, Text } from '@chakra-ui/react';
import { IoMdClose } from 'react-icons/io';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      variant="subtle"
      colorScheme="orange"
      p={1}
      borderRadius={'lg'}
      textTransform={'capitalize'}
    >
      <Text mr={1}>{user.name}</Text>
      <IoMdClose cursor={'pointer'} onClick={handleFunction} />
    </Badge>
  );
};
export default UserBadgeItem;
