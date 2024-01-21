import { redirect } from 'next/navigation';

import { ROUTES } from '@/routes/routes.handler';

export default async function CatchAllPage() {
  redirect(ROUTES.main());
}
