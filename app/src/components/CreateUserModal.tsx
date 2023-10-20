import { createChatUser } from "@/util/program/createChatUser";
import { Button, Divider, Flex, Input, Modal, ModalContent, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react"
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";


type Props = {
  isOpen: boolean,
  onClose: any,
}


export const CreateUserModal = ({ isOpen, onClose }: Props) => {

  const wallet = useAnchorWallet()
  const toast = useToast()


  const [name, setName] = useState<string>("")

  const handleCreateUser = async () => {

    const id = Math.round(Number(Math.random() * 1000))
    const res = await createChatUser(wallet as NodeWallet, id, name)
    console.log(res)
    if (!res.error) {
      toast({
        status: "success",
        title: "Created your chat user!"
      })
      onClose(false)
    } else {
      toast({
        status:"error",
        title: res.error.toString()
      })
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>

      <ModalOverlay bg="#00000040" />
      <ModalContent
        bg="gray.800"
        minH="30vh"
        h="30rem"
        maxW="30vw"
        padding="0 1rem"
      >
        <ModalHeader color="white">Create your on-chain chat user</ModalHeader>
        <Divider borderColor="gray.600" mb="2rem" />

        <Text color="gray.300">Enter your name</Text>
        <Input fontSize="20px" onChange={(e) => setName(e.target.value)} placeholder="Name" color="white" />

        <Button onClick={handleCreateUser} mt="2rem" colorScheme="green">Create</Button>
      </ModalContent>
    </Modal>
  )
}