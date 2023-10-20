import React, { useEffect, useState } from 'react';
import { Flex, Input, Button, Text, useToast, LinkBox, LinkOverlay, Box, HStack, VStack, Avatar, IconButton } from '@chakra-ui/react';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';

import { ChatIcon, CopyIcon, DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons';

import { anchorProgram } from '@/util/helper';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { fetchChatUserAccount } from '@/util/program/fetchChatUserAccount';
import { sendMessage } from '@/util/program/sendMessage';

const ChatRoom: React.FC = () => {
  const wallet = useAnchorWallet();

  const [chats, setChats] = useState<any[]>([])
  const [guests, setGuests] = useState<string[]>([])
  const [creator, setCreator] = useState()
  const [chatUser, setChatUser] = useState<any>()
  const toast = useToast()
  const router = useRouter()
  const [newMessage, setNewMessage] = useState<string>("")

  const { id } = router.query

  const handleSendMessage = async () => {
    console.log(Number(id), chatUser.id, newMessage, chatUser.name)
    const res = await sendMessage(wallet as NodeWallet, Number(id), chatUser.id, newMessage, chatUser.name)
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
      const details = chatUser.accounts[2].account;
      console.log(details);
      setChatUser(details);
    };

    // Fetch data initially
    fetchData();

    // Set up an interval to fetch data every 1 second
    const interval = setInterval(fetchData, 1000);

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, [wallet]);

  return (

    <>
      <Navbar />
      <Flex bg="#232735" h="95vh" overflow="hidden" w="100%" align="center" justify="center">
        <Flex w="500px" h="700px" borderWidth="1px" flexFlow="column" justify="space-between" borderRadius="lg" overflow="scroll">
          <Flex direction="column" p={4} flex="1" overflowY="auto">
            {chatUser && chats && chats.map((message: any, index: number) => (
              <>
                <Flex justify={message.username === chatUser.name ? "end" : "start"} padding="0 10px" key={index} align="flex-start" mb={1}>
                  <VStack align={message.username === chatUser.name ? "end" : "start"} spacing={0} padding="0 1rem" bg={message.username === chatUser.name ? "#435eae" : "#3a435e"} rounded="5px">

                    <Text fontSize="1.4rem" color="white" fontWeight="bold" textAlign="end">
                      {message.username}
                    </Text>

                    <Text color="gray.200" mt="-4px !important" fontSize="1.2rem">{message.message}</Text>
                  </VStack>
                </Flex>
                <Text color="gray.500" textAlign={message.username === chatUser.name ? "end" : "start"}>{new Date(message.date).toLocaleTimeString()}</Text>
              </>))}
          </Flex>
          <HStack p={2} bg="gray.600">
            <Input
              color='white'
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

        <Flex justify="space-between" align="center" mb={4}>
          <VStack align="flex-start">
            <Text fontWeight="bold">Creator</Text>
            <Avatar name={creator} size="sm" />
          </VStack>

          <VStack align="flex-start">
            <Text fontWeight="bold">Guests</Text>
            {guests.map((guest) => (
              <Avatar key={guest} name={guest} size="sm" />
            ))}
          </VStack>
        </Flex>
      </Flex>
    </>

  );
};

export default ChatRoom;