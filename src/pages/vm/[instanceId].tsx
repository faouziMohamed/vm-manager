import { Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import InstanceDetails from '@/Components/InstanceView/InstanceDetails';
import InstanceHeadline from '@/Components/InstanceView/InstanceHeadline';
import PageBreadcrumb from '@/Components/InstanceView/PageBreadcrumb';
import VmInstanceControlButtons from '@/Components/InstanceView/VmInstanceControlButtons';
import Layout from '@/Components/Layout/Layout';
import { useVmInstance } from '@/Services/client/vmInstances.service';

export default function VmPage() {
  const router = useRouter();
  const { instanceId } = router.query as { instanceId: string | undefined };
  const { data: instance, mutate } = useVmInstance(instanceId);
  if (!instance) return null;

  return (
    <Layout>
      <Stack spacing={5} fontFamily='var(--font-primary)'>
        <PageBreadcrumb
          shouldRenderName={!!instanceId}
          currentPageLink={router.asPath}
          serverName={instance.serverName}
        />
        <InstanceHeadline instance={instance} mutate={mutate} />
        <VmInstanceControlButtons instance={instance} />
        <InstanceDetails instance={instance} />
      </Stack>
    </Layout>
  );
}

VmPage.auth = {
  redirectTo: '/',
};
