/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
  Box,
  useClipboard,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { BiSolidShow } from 'react-icons/bi';
import { ChatState } from '../../context/chatProvider';

const ProfileModal = ({ user, children }) => {
  const { selectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onCopy, setValue, hasCopied } = useClipboard('');

  useEffect(() => {
    setValue(user.email);
  }, [selectedChat]);

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: 'flex' }}
          icon={<BiSolidShow />}
          onClick={onOpen}
          size={'3xl'}
          h={'4xs'}
          bg={'transparent'}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={'10px'}>
          <ModalHeader
            fontSize={'3xl'}
            fontWeight={'bold'}
            display={'flex'}
            justifyContent={'center'}
            color={'orange.600'}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            rowGap={'15px'}
            justifyContent={'center'}
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Box display={'flex'} columnGap={'5px'}>
              <Text>E-mail: </Text>
              <Text
                fontSize={{ base: 'sm', md: 'md' }}
                fontFamily={'Work sans'}
                fontWeight={'bold'}
              >
                {user.email}
              </Text>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              size={'sm'}
              variant={'outline'}
              colorScheme="red"
              mr={3}
              onClick={onCopy}
            >
              {hasCopied ? 'Copied!' : 'Copy E-mail'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ProfileModal;
