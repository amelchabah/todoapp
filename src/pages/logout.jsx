// src/pages/logout.jsx
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Logout() {
    useEffect(() => {
        const logout = async () => {
            await supabase.auth.signOut();
            window.location.href = '/login'; // Redirige vers la page de connexion
        };

        logout();
    }, []);

    return <div>Déconnexion en cours...</div>;
}
