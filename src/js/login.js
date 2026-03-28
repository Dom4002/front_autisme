import { supabase } from './supabase.js';

const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Loader visuel
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.innerText = 'Connexion...';

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert('Erreur: ' + error.message);
        btn.disabled = false;
        btn.innerText = 'Sign In';
    } else {
        // Succès : Redirection vers admin
        window.location.href = '/admin.html';
    }
});
