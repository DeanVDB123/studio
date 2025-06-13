
import { redirect } from 'next/navigation';

export default function HomePage() {
  // According to Next.js documentation, if app/page.tsx (or .js) exists,
  // it takes precedence over public/index.html for the root path.
  // To display the content of public/index.html, we redirect to it.
  // This will change the URL in the browser to /index.html.
  // A cleaner solution, if possible, would be to remove or rename this app/page.tsx file
  // so that public/index.html is served directly for the root path.
  redirect('/index.html');
  // redirect() throws an error that Next.js handles to perform the redirection,
  // so no explicit return is needed here in a Server Component.
}
