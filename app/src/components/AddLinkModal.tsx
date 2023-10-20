import { addLink } from "@/util/program/addLink";
import { Button, Divider, Flex, Input, LinkBox, Modal, ModalContent, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react"
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";


type Props = {
    isOpen: boolean,
    onClose: any,
    account: any,
    setReload: any,
}

function processURL(input: string) {
    // Define a regular expression to match URLs starting with "https://"
    const httpsRegex = /^https:\/\/(.+)$/;
  
    // Check if the input matches the "https://" pattern
    const httpsMatch = input.match(httpsRegex);
  
    if (httpsMatch) {
      // If it's a valid "https://" URL, return the part after "https://"
      return httpsMatch[1];
    } else if (/^(\w+\.)+\w+$/.test(input)) {
      // Check if it's a valid URL without "https://", e.g., amazon.com
      return input;
    } else {
      // If it doesn't match either pattern, return false
      return false;
    }
  }
  

export const AddLinkModal = ({ setReload, isOpen, onClose, account }: Props) => {

    const wallet = useAnchorWallet()
    const toast = useToast()


    const [link, setLink] = useState<string>("")
    const [name, setName] = useState<string>("")

    const handleAddLink = async () => {

        const linktest = processURL(link)
        console.log(linktest)
        if (!linktest) {
            return toast({
                status:"error",
                title:"Invalid url"
            })
        }
        const id = Math.round(Number(Math.random() * 1000))
        const res = await addLink(wallet as NodeWallet, account.account.id, name, linktest)
        console.log(res)
        if (!res.error) {
          toast({
            status: "success",
            title: "Added A New Link!"
          })
          setReload(+new Date())

          onClose(false)
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
                <ModalHeader color="white">Add New Link</ModalHeader>
                <Divider borderColor="gray.600" mb="2rem" />

                <Text color="gray.300">Enter URL</Text>
                <Input fontSize="20px" type="url" onChange={(e) => setLink(e.target.value)} placeholder="URL" color="white" />
                <Divider borderColor="gray.600" mb="2rem" />

                <Text color="gray.300">Enter URL Name</Text>
                <Input fontSize="20px" onChange={(e) => setName(e.target.value)} placeholder="Name" color="white" />

                <Button onClick={handleAddLink} mt="2rem" colorScheme="green">Add</Button>
            </ModalContent>
        </Modal>
    )
}