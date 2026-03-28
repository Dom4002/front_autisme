import { supabase } from './supabase.js';

/**
 * 1. PROTECTION INITIALE
 * Si l'utilisateur est déjà connecté, on le redirige directement vers l'admin
 * pour éviter qu'il ne se reconnecte inutilement.
 */
async function checkExistingSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.href = '/admin.html';
    }
}

const form = document.getElementById('login-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const submitBtn = form.querySelector('button');
        const originalBtnText = submitBtn.innerHTML;

        // Nettoyage des entrées
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // --- ÉTAT DE CHARGEMENT PRO ---
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch animate-spin mr-2"></i> Authenticating...`;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            // --- SUCCÈS ---
            Swal.fire({
                icon: 'success',
                title: 'Welcome Back!',
                text: 'Access granted. Redirecting to dashboard...',
                timer: 1500,
                showConfirmButton: false,
                position: 'top-end',
                toast: true
            }).then(() => {
                window.location.href = '/admin.html';
            });

        } catch (err) {
            // --- ERREUR ---
            console.error("Auth error:", err.message);
            
            // On réinitialise le bouton
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            // Alerte pro pour l'erreur
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid credentials. Please check your email and password.',
                confirmButtonColor: '#e11d48',
                customClass: {
                    popup: 'rounded-3xl'
                }
            });
        }
    });
}

// Lancement de la vérification de session au chargement
checkExistingSession();
