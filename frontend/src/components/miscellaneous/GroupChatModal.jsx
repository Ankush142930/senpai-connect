/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Box,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ChatState } from '../../context/chatProvider';
import axios from 'axios';
import UserListItem from '../user avatar/UserListItem';
import UserBadgeItem from '../user avatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }

    setLoading(true);
    setSearch(query);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
    setSearchResults([]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToDelete._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/chat/group',
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();

      toast({
        title: 'Group chat successfully created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      toast({
        title: 'Failed to create the group chat!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={'flex'} justifyContent={'center'}>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
            <FormControl>
              <Input
                mb={2}
                placeholder="Group Chat Name"
                type="text"
                fontSize={'xs'}
                size={'sm'}
                borderRadius={'lg'}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Input
                placeholder="Add users eg: Ankush, Deepanshu, etc."
                fontSize={'xs'}
                mb={1}
                type="text"
                size={'sm'}
                borderRadius={'lg'}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box
              w={'100%'}
              display={'flex'}
              flexWrap={'wrap'}
              columnGap={2}
              mt={1}
              mb={1}
            >
              {selectedUsers?.map((user) => {
                return (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                );
              })}
            </Box>

            {loading ? (
              <Spinner color="orange.500" />
            ) : (
              searchResults?.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant={'outline'}
              colorScheme="orange"
              onClick={handleSubmit}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default GroupChatModal;
