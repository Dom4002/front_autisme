import { supabase } from './supabase.js';

// --- AUTHENTIFICATION & INITIALISATION ---
async function initAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = "/login.html";
        return;
    }
    loadEnrollments();
}

// --- CHARGEMENT DES DONNÉES ---
async function loadEnrollments() {
    const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erreur de chargement:", error);
        return;
    }
    
    const list = document.getElementById('enrollment-list');
    
    if (data.length === 0) {
        list.innerHTML = `<tr><td colspan="6" class="text-center p-8 text-slate-400">Aucune inscription pour le moment.</td></tr>`;
        return;
    }

    list.innerHTML = data.map(item => {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        const statusClass = statusColors[item.status] || 'bg-slate-100 text-slate-800';

        return `
            <tr id="enrollment-${item.id}" class="hover:bg-slate-50/50 transition-colors">
                <td class="p-4 font-medium text-slate-800">${item.parent_name}<br><span class="font-normal text-xs text-slate-400">${item.email}</span></td>
                <td class="p-4 text-slate-600">${item.child_name} (${item.child_age} ans)</td>
                <td class="p-4 text-slate-600 capitalize">${item.program.replace('_', ' ')}</td>
                <td class="p-4 text-sm text-slate-500">${new Date(item.created_at).toLocaleDateString()}</td>
                <td class="p-4 text-center">
                    <span class="px-3 py-1 rounded-full text-xs font-bold ${statusClass}">${item.status}</span>
                </td>
                <td class="p-4 text-right space-x-4">
                    <button data-id="${item.id}" class="confirm-btn text-brand-trust hover:underline font-bold">Confirmer</button>
                    <button data-id="${item.id}" class="delete-btn text-brand-love hover:underline font-bold">Supprimer</button>
                </td>
            </tr>
        `;
    }).join('');

    // Après avoir inséré le HTML, on ajoute les écouteurs d'événements
    addEventListeners();
}

// --- GESTION DES ACTIONS ---
function addEventListeners() {
    // Boutons Confirmer
    document.querySelectorAll('.confirm-btn').forEach(btn => {
        btn.addEventListener('click', () => confirmEnrollment(btn.dataset.id));
    });

    // Boutons Supprimer
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteEnrollment(btn.dataset.id));
    });
}

async function confirmEnrollment(id) {
    const { error } = await supabase
        .from('enrollments')
        .update({ status: 'confirmed' })
        .eq('id', id);

    if (error) {
        alert("Erreur lors de la confirmation.");
    } else {
        loadEnrollments(); // On recharge le tableau pour voir le changement
    }
}

async function deleteEnrollment(id) {
    // Pop-up de confirmation
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette inscription ?")) return;

    const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', id);

    if (error) {
        alert("Erreur lors de la suppression.");
    } else {
        // Option 1 : Recharger tout le tableau
        loadEnrollments(); 
        
        // Option 2 (plus rapide) : Supprimer juste la ligne de l'UI
        // document.getElementById(`enrollment-${id}`).remove();
    }
}

// --- DÉCONNEXION ---
document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = "/login.html";
});

// --- DÉMARRAGE ---
initAdmin();
