/* eslint-disable no-unused-vars */
import {
  Avatar,
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  Input,
  useToast,
  Spinner,
  Container,
} from '@chakra-ui/react';
import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { BsFillBellFill } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';
import { ChatState } from '../../context/chatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../user avatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please something to search for',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
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

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to load the search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoading(true);

      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/chat', { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoading(false);
      onClose();
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

  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        bg="rgba(254,235,200,0.5)"
        w={'100%'}
        p={'5px 10px 5px 10px'}
        borderWidth={'2px'}
        borderRadius={'lg'}
      >
        <Tooltip
          label="Search Users to chat"
          hasArrow
          placement="bottom-end"
          bg={'orange.600'}
        >
          <Button
            variant={'ghost'}
            colorScheme="orange"
            bg={'white'}
            size={'sm'}
            onClick={onOpen}
          >
            <IoSearch />
            <Text display={{ base: 'none', md: 'flex' }} px={'1px'}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Box display={'flex'} alignItems={'center'}>
          <Text
            fontFamily={'Work sans'}
            fontSize={{ base: 'sm', md: '2xl' }}
            fontWeight={'bold'}
          >
            Senpai-Connect
          </Text>
          <img src="./src/assets/logo3.png" alt="logo" width={40} height={40} />
        </Box>

        <div
          style={{ display: 'flex', alignItems: 'center', columnGap: '5px' }}
        >
          <Menu>
            <MenuButton>
              <BsFillBellFill />
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              />
            </MenuButton>
            <MenuList>
              {!notifications.length && 'No new messages'}
              {notifications.map((notif) => {
                return (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotifications(
                        notifications.filter((n) => n !== notif)
                      );
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New message in ${notif.chat.chatName}`
                      : `New message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              variant={'ghost'}
              as={Button}
              rightIcon={<FaChevronDown />}
              size={'md'}
              _hover={{
                background: 'orange.100',
              }}
            >
              <Avatar
                size={'sm'}
                cursor={'pointer'}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem h={'8xs'} fontSize={'xs'} fontWeight={'semibold'}>
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                h={'8xs'}
                fontSize={'xs'}
                fontWeight={'semibold'}
                onClick={logoutHandler}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display={'flex'} paddingBottom={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size={'xs'}
              />
              <Button onClick={handleSearch} colorScheme="orange" size={'xs'}>
                Ike!!
              </Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}

            {loading && (
              <Spinner ml={'auto'} display={'flex'} justifyContent={'center'} />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default SideDrawer;
