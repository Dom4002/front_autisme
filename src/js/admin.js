// admin.js
import { supabase } from "./supabase.js";

// Si aucun utilisateur n'est connecté, on dégage vers login.html
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) {
  window.location.href = "/login.html";
}

// Vérifier si l'utilisateur est connecté
async function checkAuth() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = "/login.html"; // On créera cette page après
  }
}

// Charger les inscriptions
async function loadEnrollments() {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur:", error);
    return;
  }

  const list = document.getElementById("enrollment-list");
  list.innerHTML = data
    .map(
      (item) => `
        <tr class="hover:bg-slate-50">
            <td class="p-6 font-medium">${item.parent_name}<br><span class="text-xs text-slate-400">${item.email}</span></td>
            <td class="p-6">${item.child_name} (${item.child_age} ans)</td>
            <td class="p-6 capitalize">${item.program.replace("_", " ")}</td>
            <td class="p-6 text-sm text-slate-500">${new Date(item.created_at).toLocaleDateString()}</td>
            <td class="p-6">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">${item.status}</span>
            </td>
        </tr>
    `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  loadEnrollments();
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "/login.html";
});
