import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { AvailableRegions, availableRegions, Region } from '@/lib/vmUtils';

const handler = nc();
const regions: Region[] = [...availableRegions];
handler.get((req, res: NextApiResponse<AvailableRegions>) => {
  res.json({ regions, count: availableRegions.length });
});

export default handler;
