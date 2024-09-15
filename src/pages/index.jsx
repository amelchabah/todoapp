import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>home</title>
      </Head>
      <main>
        <h1>home</h1>
        <Link href='/login'>
          Log in
        </Link>
        <br />
        <Link href='/signin'>
          Sign up
        </Link>
      </main>
    </>

  );
}
