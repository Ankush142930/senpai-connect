/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { BiSolidShow } from 'react-icons/bi';
import { ChatState } from '../../context/chatProvider';
import { useEffect, useState } from 'react';
import UserBadgeItem from '../user avatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../user avatar/UserListItem';

const UpdateChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();
  const toast = useToast();

  const handleRemove = async (userToDelete) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToDelete._id !== user._id
    ) {
      toast({
        title: 'Only admin is allowed to add someone!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/chat/groupremove',
        {
          chatId: selectedChat._id,
          userId: userToDelete._id,
        },
        config
      );

      userToDelete._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Unable to add to the group!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: 'User is already added in the group!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admin is allowed to add someone!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/chat/groupadd',
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Unable to add to the group!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: 'Group Chat name cannot be updated to nothing!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/chat/rename',
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: 'Failed to update the group chat name!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setRenameLoading(false);
    }

    setGroupChatName('');
  };

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
      console.log(data);
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

  useEffect(() => {
    setSelectedUsers([...selectedChat.users]);
  }, [fetchAgain]);

  return (
    <>
      <IconButton
        display={{ base: 'flex' }}
        icon={<BiSolidShow />}
        onClick={onOpen}
        size={'3xl'}
        h={'4xs'}
        bg={'transparent'}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={'flex'}
            justifyContent={'center'}
            fontSize={{ base: 'xl', md: '3xl' }}
            fontWeight={'bold'}
            fontFamily={'Work Sans'}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              w={'100%'}
              display={'flex'}
              columnGap={2}
              flexWrap={'wrap'}
              mt={1}
              mb={1}
            >
              {selectedChat.users.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                );
              })}
            </Box>
            <FormControl
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              mb={2}
            >
              <Input
                placeholder="Group Chat Name"
                type="text"
                fontSize={'xs'}
                size={'sm'}
                borderRadius={'lg'}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={'ghost'}
                colorScheme="orange"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
                size={'sm'}
                fontWeight={'bold'}
                cursor={'pointer'}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
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
            {loading ? (
              <Spinner color="orange.500" />
            ) : (
              searchResults?.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant={'solid'}
              colorScheme="red"
              mr={3}
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default UpdateChatModal;
