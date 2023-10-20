import React, { useEffect, useState } from 'react';
import { Flex, Input, Button, Text, useToast, LinkBox, LinkOverlay } from '@chakra-ui/react';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { addLink } from '@/util/program/addLink';
import { getAccount } from '@/util/program/getAccount';
import { CopyIcon, DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { AddLinkModal } from '@/components/AddLinkModal';
import { getLinks } from '@/util/program/getLinks';
import { removeLink } from '@/util/program/removeLink';
import { getLinksByProfile } from '@/util/program/getLinksByProfile';

const LinkPage: React.FC = () => {
  const wallet = useAnchorWallet();

  const [links, setLinks] = useState<any[]>([])

  const toast = useToast()
  const router = useRouter()

  const { link } = router.query

  useEffect(() => {

    if (!wallet) return
    const fetchData = async () => {

      if (!link) return
      const data = await getLinksByProfile(wallet as NodeWallet, link as string)
      setLinks(data.sig.map((l: any) => { return { address: l.publicKey.toBase58(), name: l.account.linkName, url: l.account.linkUrl } }))
      console.log(data)
    }
    fetchData()
  }, [wallet])



  return (

    <>
      <Navbar />

      <Flex flexFlow="column" gap="1rem" bg="#05070D" minH="100vh" h="100%" p="0 10rem">

        <Flex align="center" flexFlow="column" justify="center" gap="10px">
          <Text color="white" fontSize="60px">@{link}</Text>


          <Flex flexFlow="column" gap="1.5rem">
            {links.map((l) => (
              <LinkBox key={l.address} sx={{
                width: "40vw",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "60px",
                padding: "10px",
                background: "#515175",
                transition:"50ms ease-out",
                _hover: {
                  transform:"scale(1.06)"
                }
              }}>
                <LinkOverlay target="_blank" href={`https://${l.url}`} />
                <Text fontSize="30px" color="white" fontWeight={700}>{l.name}</Text>
              </LinkBox>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </>

  );
};

export default LinkPage;
