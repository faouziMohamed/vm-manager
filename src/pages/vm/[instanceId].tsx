import { Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import ConsoleIcon from '@/Components/images/ConsoleIcon';
import InstanceDetails from '@/Components/InstanceView/InstanceDetails';
import InstanceHeadline from '@/Components/InstanceView/InstanceHeadline';
import PageBreadcrumb from '@/Components/InstanceView/PageBreadcrumb';
import VmInstanceControlButtons from '@/Components/InstanceView/VmInstanceControlButtons';
import Layout from '@/Components/Layout/Layout';
import Paragraph from '@/Components/Paragraph';
import { useVmInstance } from '@/Services/client/vm.service';

export default function VmPage() {
  const router = useRouter();
  const { instanceId } = router.query as { instanceId: string | undefined };
  const { data: instance, mutate, error } = useVmInstance(instanceId);
  if (!instance) return null;
  if (instance && error) {
    return (
      <Layout>
        <Stack spacing={5} fontFamily='var(--font-primary)' h='100%'>
          <PageBreadcrumb
            shouldRenderName={!!instanceId}
            currentPageLink={router.asPath}
            serverName={instance.serverName}
          />
          <InstanceHeadline instance={instance} />
          <Stack
            alignItems='center'
            justifyContent='center'
            h='100%'
            spacing={5}
            pt='3rem'
          >
            <Paragraph fontSize='1rem'>
              The Virtual Machine you are looking for does not exist.
            </Paragraph>
            <ConsoleIcon width='10rem' />
          </Stack>
        </Stack>
      </Layout>
    );
  }
  return (
    <Layout>
      <Stack spacing={5} fontFamily='var(--font-primary)'>
        <PageBreadcrumb
          shouldRenderName={!!instanceId}
          currentPageLink={router.asPath}
          serverName={instance.serverName}
        />
        <InstanceHeadline instance={instance} />
        <VmInstanceControlButtons instance={instance} mutate={mutate} />
        <InstanceDetails instance={instance} />
      </Stack>
    </Layout>
  );
}

VmPage.auth = {};
