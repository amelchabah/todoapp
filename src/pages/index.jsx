import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/index.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>home</title>
      </Head>
      <div className={styles.homepage}>

        <nav className={styles.homepage_navbar}>
          <Link href='/login' title='Log in' className='button secondary'>
            Log in
          </Link>
          <Link href='/signup' title='Sign up' className='button primary'>
            Sign up
          </Link>
        </nav>
        <header className={styles.homepage_header}>
          <h1>todo app 🥠</h1>
          <h2>your local task manager :)</h2>
        </header>
        <div className={styles.homepage_content}>

        </div>
      </div>

    </>

  );
}
