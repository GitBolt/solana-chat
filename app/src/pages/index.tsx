import { Avatar, Badge, Box, Button, Center, Divider, Flex, HStack, Input, Spacer, Text, VStack, useToast } from '@chakra-ui/react'
import { Navbar } from '@/components/Navbar'
import { useRouter } from 'next/router'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'
import { useEffect, useState } from 'react'
import { fetchChatrooms } from '@/util/program/fetchChatRooms'
import { formatTime } from '@/util/helper'


export default function Home() {


  const router = useRouter()
  const wallet = useAnchorWallet()
  const toast = useToast()
  const [chatRooms, setChatrooms] = useState<any>()

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchChatrooms(wallet as NodeWallet)
      if (data && !data.error) {
        console.log(data.accounts)
        setChatrooms(data.accounts)
      }
    }

    fetchData()
  }, [])

 

  return (
    <>

      <Navbar />

      <Flex flexFlow="column" gap="1rem" justify="center" bg="#232735" align="center" minH="92.5vh" h="100%" p="0 10rem">

        <Text fontSize="70px" color="white" fontWeight={800}>Join or Create a Chat Room!</Text>


        {chatRooms && chatRooms.length ?
        <VStack spacing={0} align="stretch">
        {chatRooms.map((chat: any, index: number) => {

          <Divider />
          const chatMessages = JSON.parse(chat.chats);

          if (chatMessages.length == 0) {
            return (
              <HStack key={chat.id} justify="space-between" border="1px solid" borderColor="#2e2c3a" w="50rem" h="6rem" padding="5px 10px" rounded="5px">
                <Text fontSize="2rem" color="white">Nothing here yet...</Text>
                <Button size="sm" fontSize="1.2rem" padding="1.3rem 1rem" colorScheme="telegram">Be The First One to Message</Button> 
              </HStack>
            );
          }
          const lastMessage = chatMessages[chatMessages.length - 1];
          const date = new Date(lastMessage.date);
          const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <HStack key={chat.id} justify="space-between" border="1px solid" borderColor="#2e2c3a" w="50rem" h="6rem" padding="5px 10px" rounded="5px">
              <Avatar size="md" src={`avatar-url-here`} />
              <Box flex="1">
                <Text  fontSize="1.4rem" color="gray.200" fontWeight="bold">{chat.creator}</Text>
                <Text fontSize="1.2rem" color="gray.500">{lastMessage.message}</Text>
              </Box>
              <Text fontSize="1.2rem" color="gray.400">{time}</Text>
              <Button size="sm" fontSize="1.2rem" padding="1.3rem 1rem" colorScheme="telegram">Join</Button> 
            </HStack>
          );
        })}

        <Button colorScheme="green" w="50%" marginTop="1.2rem !important" h="3rem" fontSize="1.2rem" alignSelf="center">Create Room</Button>
      </VStack>
          : <Button onClick={() => router.push("/admin")} w="30%" fontSize="30px" colorScheme='green' h="70px"  >No chat rooms here. Maybe create your own?</Button>}
      </Flex>


    </>
  )
}
