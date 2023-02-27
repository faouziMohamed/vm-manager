import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { availableRegions } from '@/lib/constants';
import { AvailableRegions, Region } from '@/lib/types';

const handler = nc();
const regions: Region[] = [...availableRegions];
handler.get((req, res: NextApiResponse<AvailableRegions>) => {
  res.json({ regions, count: availableRegions.length });
});

export default handler;
