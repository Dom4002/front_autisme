import { supabase } from './supabase.js';

// --- INITIALISATION & AUTHENTIFICATION ---
async function initAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = "/login.html";
        return;
    }

    // Affiche l'email de l'admin
    document.getElementById('admin-email').innerText = session.user.email;

    // Chargement des données
    await loadEnrollments();

    // On cache le loader de page avec un fondu
    const loader = document.getElementById('page-loader');
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
}

// --- CHARGEMENT DES DONNÉES ---
async function loadEnrollments() {
    const { data, error, count } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    if (error) {
        Swal.fire({ icon: 'error', title: 'Erreur de chargement', text: error.message });
        return;
    }

    // Mise à jour du compteur
    document.getElementById('total-count').innerText = count;

    const list = document.getElementById('enrollment-list');
    
    if (data.length === 0) {
        list.innerHTML = `<tr><td colspan="6" class="text-center p-20 text-slate-400 font-medium">Aucune inscription trouvée.</td></tr>`;
        return;
    }

    list.innerHTML = data.map(item => {
        const statusColors = {
            'pending': 'bg-amber-50 text-amber-600 border-amber-100',
            'confirmed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
            'cancelled': 'bg-rose-50 text-rose-600 border-rose-100'
        };
        const statusClass = statusColors[item.status] || 'bg-slate-50 text-slate-600';

        return `
            <tr class="hover:bg-slate-50/50 transition-all duration-200 group">
                <td class="p-6 font-semibold text-slate-900">
                    ${item.parent_name}
                    <div class="text-xs text-slate-400 font-normal tracking-tight flex items-center gap-1">
                        <i class="fa-regular fa-envelope"></i> ${item.email}
                    </div>
                </td>
                <td class="p-6">
                    <span class="text-slate-700 font-medium">${item.child_name}</span>
                    <div class="text-xs text-slate-400">${item.child_age} ans</div>
                </td>
                <td class="p-6">
                    <span class="bg-blue-50 text-brand-trust text-[10px] font-bold uppercase px-2 py-1 rounded-md border border-blue-100">
                        ${item.program.replace('_', ' ')}
                    </span>
                </td>
                <td class="p-6 text-xs text-slate-500 font-medium">
                    ${new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </td>
                <td class="p-4 text-center">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusClass}">
                        ${item.status}
                    </span>
                </td>
                <td class="p-6 text-right">
                    <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="updateStatus('${item.id}', 'confirmed')" class="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm" title="Confirmer">
                            <i class="fa-solid fa-check"></i>
                        </button>
                        <button onclick="deleteEnrollment('${item.id}')" class="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="Supprimer">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// --- ACTIONS SYNCHRONES ---

// Mise à jour du statut
window.updateStatus = async (id, newStatus) => {
    const { error } = await supabase.from('enrollments').update({ status: newStatus }).eq('id', id);
    
    if (error) {
        Swal.fire({ icon: 'error', title: 'Erreur', text: error.message });
    } else {
        loadEnrollments(); // Rechargement synchrone
        Swal.fire({ icon: 'success', title: 'Statut mis à jour', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
    }
};

// Suppression
window.deleteEnrollment = async (id) => {
    const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Cette action est irréversible !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e11d48',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Oui, supprimer !'
    });

    if (result.isConfirmed) {
        const { error } = await supabase.from('enrollments').delete().eq('id', id);
        if (error) {
            Swal.fire('Erreur', error.message, 'error');
        } else {
            loadEnrollments();
            Swal.fire('Supprimé !', 'L\'inscription a été retirée.', 'success');
        }
    }
};

// --- LOGOUT ---
document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = "/login.html";
});

initAdmin();
