import { Box } from '@chakra-ui/react';

import Paragraph from '@/Components/Paragraph';

export default function NoInstanceFoundForAppliedFilter() {
  return (
    <Box textAlign='center' py='1rem'>
      <Paragraph>No instances found for the applied filter</Paragraph>
    </Box>
  );
}
