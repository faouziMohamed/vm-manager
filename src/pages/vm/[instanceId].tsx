import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { IoChevronForward } from 'react-icons/io5';

import ChakraLink from '@/Components/ChakraLink';
import Layout from '@/Components/Layout/Layout';
import { useVmInstance } from '@/Services/hooks';

export default function VmPage() {
  const router = useRouter();
  useEffect(() => {
    console.log('router.isReady', router.isReady);
  }, [router.isReady]);

  const { instanceId } = router.query as { instanceId: string | undefined };
  const { data: instance, error, isLoading } = useVmInstance(instanceId);

  return (
    <Layout>
      <Box fontFamily='var(--font-primary)'>
        <Breadcrumb pt='3' separator={<IoChevronForward />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={ChakraLink} href=''>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          {/* this creates the exact same HTML as for page 1 */}
          <BreadcrumbItem>
            <BreadcrumbLink as={ChakraLink} href=''>
              {instanceId}
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        </Breadcrumb>
        <style jsx global>
          {`
            .chakra-breadcrumb__list-item span {
              margin: 0;
              padding-inline: 0.2rem;
            }
          `}
        </style>
      </Box>
    </Layout>
  );
}
