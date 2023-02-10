import { useRouter } from 'next/router';

import Layout from '@/Components/Layout/Layout';

export default function VmPage() {
  const router = useRouter();
  const { vmId } = router.query;

  console.dir(router, { depth: null });

  return (
    <Layout>
      <div>
        <h1>VM {vmId}</h1>
      </div>
    </Layout>
  );
}
