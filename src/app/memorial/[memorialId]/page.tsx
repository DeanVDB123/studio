
import { getMemorialById } from '@/lib/data';
import MemorialClientPage from '@/components/memorial/MemorialClientPage';

interface MemorialPageProps {
  params: {
    memorialId: string;
  };
}

// NOTE: generateMetadata is a server-only function. It is kept in this server component
// while the client logic is moved to <MemorialClientPage />.
export async function generateMetadata({ params }: MemorialPageProps) {
  const memorial = await getMemorialById(params.memorialId);
  if (!memorial) {
    return { title: 'Memorial Not Found | HonouredLives' };
  }
  return {
    title: `${memorial.deceasedName} | HonouredLives`,
    description: `A memorial page for ${memorial.deceasedName}. ${memorial.lifeSummary || ''}`,
  };
}

export default function MemorialPage({ params }: MemorialPageProps) {
  return <MemorialClientPage memorialId={params.memorialId} />;
}
