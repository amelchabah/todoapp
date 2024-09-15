import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from '@/styles/signup.module.scss';
import Head from 'next/head';
import Link from 'next/link';
/* eslint-disable react/no-unescaped-entities */

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null); // Réinitialiser l'erreur avant de faire la requête
        setSuccess(false); // Réinitialiser le succès avant de faire la requête

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
    };

    return (
        <>
            <Head>
                <title>Sign up</title>
            </Head>
            <div className={styles.signuppage_header}>
                <h1>Sign up 🥯</h1>
                <br />
                <form onSubmit={handleSignup}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Create your account</button>
                </form>
                {error && <p className='form_message' style={{ color: 'red' }}>{error}</p>}
                {success && <p className='form_message' style={{ color: 'green' }}>Success, check your inbox to continue!</p>}

                <br />
                <Link
                    href='/login'
                    title="Log in"
                    className='button tertiary'
                >
                    Already have an account ? Sign in →
                </Link>
            </div>
        </>
    );
}
