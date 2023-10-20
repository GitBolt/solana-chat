import React, { useEffect, useState } from 'react';
import { Flex, Input, Button, Text, useToast, LinkBox, LinkOverlay, Box, HStack, VStack, Avatar, IconButton, Divider, useDisclosure } from '@chakra-ui/react';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';

import { ChatIcon, CopyIcon, DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons';

import { anchorProgram } from '@/util/helper';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { fetchChatUserAccount } from '@/util/program/fetchChatUserAccount';
import { sendMessage } from '@/util/program/sendMessage';
import { joinRoom } from '@/util/program/joinRoom';
import { CreateUserModal } from '@/components/CreateUserModal';

const ChatRoom: React.FC = () => {
  const wallet = useAnchorWallet();

  const [chats, setChats] = useState<any[]>([])
  const [guests, setGuests] = useState<string[]>([])
  const [creator, setCreator] = useState()
  const [chatUser, setChatUser] = useState<any>()
  const toast = useToast()
  const router = useRouter()
  const [newMessage, setNewMessage] = useState<string>("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id } = router.query

  const handleSendMessage = async () => {
    console.log(Number(id), chatUser.id, newMessage, chatUser.name)
    const res = await sendMessage(wallet as NodeWallet, Number(id), chatUser.id, newMessage, chatUser.name)
    setNewMessage("")
    if (res.error) {
      toast({
        status: "error",
        title: res.error
      })
      return
    }
  }

  useEffect(() => {
    if (!wallet || !id) return;

    const fetchData = async () => {
      const program = anchorProgram(wallet as NodeWallet);

      // @ts-ignore
      const chatRoomData = await program.account.chatroom.all([
        {
          memcmp: {
            offset: 8,
            bytes: bs58.encode(Uint8Array.from([Number(id)])),
          },
        },
      ]);

      if (!chatRoomData || !chatRoomData.length) {
        toast({
          status: 'error',
          title: 'Unable to fetch chat room details',
        });
        return;
      } else {
        const history = JSON.parse(chatRoomData[0].account.chats);
        const creator = chatRoomData[0].account.creator.toBase58();
        const guests = chatRoomData[0].account.guests.map((g: any) => g.toBase58());
        setGuests(guests);
        setCreator(creator);
        console.log(history);
        setChats(history);
      }

      const chatUser = await fetchChatUserAccount(wallet as NodeWallet);
      console.log(chatUser)
      if (chatUser.error || !chatUser.accounts || !chatUser.accounts.length) {
        return
      }
      const details = chatUser.accounts[0].account;
      console.log(details);
      setChatUser(details);
    };

    fetchData();

    const interval = setInterval(fetchData, 600);

    return () => clearInterval(interval);
  }, [wallet]);


  const handleJoin = async () => {
    if (!chatUser) {
      toast({
        status: "error",
        title: "First create chat user and try again"
      })
      onOpen()
      return
    }
    const res = await joinRoom(wallet as NodeWallet, Number(id), chatUser.id)
    console.log(res)
  }
  return (

    <>
      <Navbar />
      <CreateUserModal isOpen={isOpen} onClose={onClose} />

      <Flex bg="#232735" h="95vh" gap="3rem" overflow="hidden" w="100%" align="center" justify="center">
        <Flex w="500px" h="700px" borderWidth="1px" flexFlow="column" justify="space-between" borderRadius="lg" overflow="scroll">
          <Flex direction="column" p={4} flex="1" overflowY="auto">
            {chats && chats.map((message: any, index: number) => (
              <>
                <Flex justify={chatUser && message.username === chatUser.name ? "end" : "start"} padding="0 10px" key={index} align="flex-start" mb={1}>
                  <VStack align={chatUser && message.username === chatUser.name ? "end" : "start"} spacing={0} padding="0 1rem" bg={chatUser && message.username === chatUser.name ? "#435eae" : "#3a435e"} rounded="5px">

                    <Text fontSize="1.4rem" color="white" fontWeight="bold" textAlign="end">
                      {message.username}
                    </Text>

                    <Text color="gray.200" mt="-4px !important" fontSize="1.2rem">{message.message}</Text>
                  </VStack>
                </Flex>
                <Text color="gray.500" textAlign={chatUser && message.username === chatUser.name ? "end" : "start"}>{new Date(message.date).toLocaleTimeString()}</Text>
              </>))}
          </Flex>
          <HStack p={2} bg="gray.600">
            <Input
              color='white'
              disabled={wallet ? creator != wallet.publicKey && !guests.includes(wallet?.publicKey.toBase58()) : true}
              fontSize="1.2rem"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <IconButton
              aria-label="Send"
              icon={<ChatIcon color="white" />}
              bg="blue.500"
              onClick={handleSendMessage}
              isDisabled={!newMessage}
            />
          </HStack>
        </Flex>

        <Flex maxWidth="300px" overflow="hidden" display="block" padding="0.5rem 0.5rem" justify="space-between" flexFlow="column" align="start" bg="#424e64" rounded="5px">

          <Flex flexFlow="column" align="start" justify="start">
            <Text fontWeight="bold" color="white" fontSize="1.3rem" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" maxWidth="100%">
              Creator
            </Text>
            <Text fontSize="1.2rem" color="gray.200" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" maxWidth="100%">
              {creator}
            </Text>

            <Divider />

            <Text fontWeight="bold" color="white" fontSize="1.3rem" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" maxWidth="100%">
              Guests
            </Text>
            {guests && guests.length ? (
              guests.map((g) => (
                <Text key={g} fontSize="1.2rem" color="gray.200" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" maxWidth="100%">
                  {g}
                </Text>
              ))
            ) : (
              <Text fontSize="1.1rem" color="gray.200" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" maxWidth="100%">
                No guests here
              </Text>
            )}

          </Flex>


        {wallet && creator != wallet.publicKey && !guests.includes(wallet?.publicKey.toBase58()) ? <Button colorScheme="telegram" w="100%" fontSize="1.3rem" onClick={handleJoin}>Join Chat Room</Button> : null}


      </Flex>
    </Flex >
    </>

  );
};

export default ChatRoom;