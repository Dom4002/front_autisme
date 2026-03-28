import { supabase } from './supabase.js';

// 1. Vérification immédiate de la connexion
async function initAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = "/login.html"; // Redirection si non connecté
        return;
    }
    
    loadEnrollments();
}

// 2. Chargement des données (uniquement si connecté)
async function loadEnrollments() {
    const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return console.error(error);
    
    const list = document.getElementById('enrollment-list');
    list.innerHTML = data.map(item => `
        <tr class="border-b">
            <td class="p-4">${item.parent_name}</td>
            <td class="p-4">${item.child_name}</td>
            <td class="p-4">${item.program}</td>
            <td class="p-4">${new Date(item.created_at).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = "/login.html";
});

initAdmin();
