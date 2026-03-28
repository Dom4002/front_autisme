import { supabase } from "./supabase.js";

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  Swal.fire({
    title: "Authenticating...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: "Invalid credentials.",
    });
  } else {
    // Redirection vers le dashboard admin après connexion réussie
    window.location.href = "/admin.html";
  }
});
