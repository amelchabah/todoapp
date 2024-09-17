// pages/login.jsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import styles from '@/styles/login.module.scss';
import Head from 'next/head';
import Link from 'next/link';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            // Connexion réussie, redirection vers le dashboard
            router.push('/dashboard');
        }
    };

    return (
        <>
            <Head>
                <title>log in</title>
            </Head>
            <div className={styles.loginpage_header}>
                <h1>Log in 🥟</h1>
                <br />

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className='primary'>Log in</button>
                </form>
                {error && <p className='form_message'>{error}</p>}

                <br />
                <Link
                    href='/signup'
                    title="Sign up"
                    className='button link'
                >
                    New here ? Create your account →
                </Link>
            </div>
        </>

    );
};

export default Login;
