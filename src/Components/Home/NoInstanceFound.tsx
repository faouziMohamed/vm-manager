import { Box, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import Paragraph from '@/Components/Paragraph';

export default function NoInstanceFound() {
  const router = useRouter();
  return (
    <Box>
      <Paragraph>You do not have any instances</Paragraph>
      <Paragraph>
        You can create a new instance by clicking the{' '}
        <Button
          variant='link'
          onClick={() => {
            void router.push('/create');
          }}
        >
          Create
        </Button>{' '}
        button
      </Paragraph>
    </Box>
  );
}
