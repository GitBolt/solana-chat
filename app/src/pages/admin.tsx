import React, { useEffect, useState } from 'react';
import { Flex, Input, Button, Text, useToast } from '@chakra-ui/react';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { addLink } from '@/util/program/addLink';
import { getAccount } from '@/util/program/getAccount';
import { CheckIcon, CloseIcon, CopyIcon, DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { AddLinkModal } from '@/components/AddLinkModal';
import { getLinks } from '@/util/program/getLinks';
import { removeLink } from '@/util/program/removeLink';
import { updateAccount } from '@/util/program/updateAccount';

const Admin: React.FC = () => {
  const wallet = useAnchorWallet();

  const [account, setAccount] = useState<any>()
  const [links, setLinks] = useState<any[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)

  const [reload, setReload] = useState<number>(+new Date())
  const toast = useToast()


  const [profileLink, setProfileLink] = useState<string>("")
  const [bgColor, setBgColor] = useState<string>("")
  const [editMode, setEditMode] = useState<boolean>(false)

  useEffect(() => {
    if (!wallet) return
    const fetchData = async () => {
      const data = await getAccount(wallet as NodeWallet)
      console.log("Data: ", data)
      setAccount(data.sig)

      const links = await getLinks(wallet as NodeWallet, data.sig.account.id)
      setLinks(links.sig.map((l: any) => { return { address: l.publicKey.toBase58(), name: l.account.linkName, url: l.account.linkUrl } }))
    }
    fetchData()
  }, [reload, wallet])



  const handleRemoveLink = async (linkName: string) => {

    const res = await removeLink(wallet as NodeWallet, account.account.id, linkName)
    console.log(res)
    if (!res.error) {
      toast({
        status: "success",
        title: "Removed a link!"
      })
      setReload(+new Date())

    }
  };

  const handleUpdateAccount = async () => {
    const res = await updateAccount(wallet as NodeWallet, account.account.id, profileLink, bgColor)
    console.log(res)
    if (!res.error) {
      toast({
        status: "success",
        title: "Updated Account"
      })
      setReload(+new Date())
      setEditMode(false)
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.hostname}/${account.account.profileLink}`)
    toast({
      status: "success",
      title: "Copied Linktree"
    })
  }

  return (

    <>
      <Navbar />

      {showModal ? <AddLinkModal setReload={setReload} account={account} isOpen={showModal} onClose={setShowModal} /> : null}
      <Flex flexFlow="column" gap="1rem" bg="#05070D" minH="100vh" h="100%" p="0 10rem">

        <Flex justify="space-between" w="100%" h="60px" bg="gray.700" borderRadius="10px" mt="1rem" align="center" p="0 1rem">
          <Flex align="center" justify="center" gap="10px">
            <Text color="white" fontSize="20px">Your Linktree is Live: </Text>
            {/* {account ?
              editMode ? <Input onChange={(e) => {setProfileLink(e.target.value)}} color="white" placeholder="New profile link" w="200px"/> :
                <a href={`/${account.account.profileLink}`} target="_blank" style={{ cursor: "pointer", color: "white", fontSize: "20px", textDecoration: "underline" }}>@{account.account.profileLink}</a> : null}
            {editMode ? <Flex gap="1rem" align="center" justify="center">
              <CheckIcon width="20px" height="20px" color="green.500" onClick={handleUpdateAccount}/>
              <CloseIcon width="20px" height="20px" color="red.500" onClick={() => setEditMode(false)}/> 
            </Flex>: <EditIcon width="20px" height="20px" color="green.500" onClick={() => setEditMode(true)} />} */}

            {account && <a href={`/${account.account.profileLink}`} target="_blank" style={{ cursor: "pointer", color: "white", fontSize: "20px", textDecoration: "underline" }}>@{account.account.profileLink}</a>}

          </Flex>


          <Flex gap="2rem" justify="center" align="center">
            <Text color="white" fontSize="20px">Share your Linktree</Text>
            <Button onClick={handleCopy} leftIcon={<CopyIcon />}>Copy</Button>
          </Flex>

        </Flex>

        <Flex w="100%" align="center" justify="center">
          {account && <Button onClick={() => setShowModal(true)} leftIcon={<PlusSquareIcon />} h="50px" fontSize="20px" borderRadius="100px" w="50%" colorScheme='purple'>Add Link</Button>}
        </Flex>

        <Flex gap="1rem" flexFlow="column" align="center" justify="center">
          {links.map((l) => (
            <Flex justify="space-between" align="center" p="0 10px" bg="gray.700" w="50%" h="80px" borderRadius="10px" key={l.address}>
              <Flex align="start" justify="center" flexFlow="column">
                <Text color="white" fontSize="30px">{l.name}</Text>
                <Text color="white" fontSize="20px">https://{l.url}</Text>
              </Flex>
              <DeleteIcon onClick={() => handleRemoveLink(l.name)} cursor="pointer" color="red" width="20px" height="20px" />
            </Flex>
          ))}
        </Flex>
      </Flex>
    </>

  );
};

export default Admin;
