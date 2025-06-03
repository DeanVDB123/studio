
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/admin');
  return null; // redirect() is a server-side utility, component won't render
}
