import { ROUTES } from '@/routes/routes.handler';
import { redirect } from 'next/navigation';

export default async function CatchAllPage() {
  redirect(ROUTES.main());
}
