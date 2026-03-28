import { supabase } from "./supabase.js";

/**
 * INITIALISATION GÉNÉRALE
 * Toutes les fonctions sont lancées une fois que le DOM est chargé.
 */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeroSlider();
  initDynamicText();
  initNavbarScroll();
  initFormsValidation();
  initFAQ();
  preSelectProgram();
});

/**
 * 1. GESTION DU MENU MOBILE
 */
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
    const icon = btn.querySelector("i");
    if (menu.classList.contains("hidden")) {
      icon.classList.replace("fa-xmark", "fa-bars");
    } else {
      icon.classList.replace("fa-bars", "fa-xmark");
    }
  });
}

/**
 * 2. VALIDATION DES FORMULAIRES & INSERTION SUPABASE (Mode Pro)
 */
function initFormsValidation() {
  const forms = document.querySelectorAll(".needs-validation");

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Récupération du bouton et de son état original
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!submitBtn) return;
      const originalBtnText = submitBtn.innerHTML;

      // Vérification de la validité HTML5
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add("was-validated");
        
        Swal.fire({
          icon: "warning",
          title: "Missing Information",
          text: "Please fill in all required fields.",
          confirmButtonColor: "#0284c7"
        });
        return;
      }

      // --- ÉTAT DE CHARGEMENT (Loading State) ---
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch animate-spin mr-2"></i> Submitting...`;

      Swal.fire({
        title: "Transmitting data...",
        text: "Please do not close this window.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        // Construction de l'objet de données
        const formData = {
          parent_name: document.getElementById("parentName")?.value || "",
          phone: document.getElementById("phone")?.value || "",
          email: document.getElementById("email")?.value || "",
          child_name: document.getElementById("childName")?.value || "",
          child_age: parseInt(document.getElementById("childAge")?.value) || 0,
          diagnosis: document.getElementById("diagnosis")?.value || null,
          sensory_needs: document.getElementById("sensoryNeeds")?.value || "",
          program: form.querySelector('input[name="program"]:checked')?.value || "unspecified",
          status: "pending"
        };

        // Insertion dans Supabase
        const { error } = await supabase.from("enrollments").insert([formData]);

        if (error) throw error;

        // --- SUCCÈS ---
        Swal.fire({
          icon: "success",
          title: "Application Received!",
          text: "Redirecting you to the next steps...",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          form.reset();
          window.location.href = "/thank-you.html";
        });

      } catch (err) {
        // --- ERREUR ---
        console.error("Supabase Error:", err.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        Swal.fire({
          icon: "error",
          title: "Submission failed",
          text: "A connection error occurred. Please try again.",
          confirmButtonColor: "#e11d48"
        });
      }
    });
  });
}

/**
 * 3. HERO SLIDER (Animation d'arrière-plan)
 */
function initHeroSlider() {
  const slides = document.querySelectorAll(".bg-slide");
  if (slides.length === 0) return;

  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove("opacity-100", "scale-100");
    slides[currentSlide].classList.add("opacity-0", "scale-105");

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.remove("opacity-0", "scale-105");
    slides[currentSlide].classList.add("opacity-100", "scale-100");
  }, 5000);
}

/**
 * 4. TEXTE DYNAMIQUE (Mots qui changent dans le Hero)
 */
function initDynamicText() {
  const textElement = document.getElementById("dynamic-word");
  if (!textElement) return;

  const path = window.location.pathname;
  let words = ["Joy", "Inclusion", "Growth"]; // Par défaut

  if (path.includes("programs")) words = ["Passion", "Skills", "Confidence"];
  else if (path.includes("parents")) words = ["Safety", "Support", "Community"];
  else if (path.includes("about")) words = ["Mission", "Vision", "Purpose"];

  let wordIndex = 0;
  setInterval(() => {
    textElement.classList.remove("fade-in");
    textElement.classList.add("fade-out");

    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      textElement.innerText = words[wordIndex];
      textElement.classList.remove("fade-out");
      textElement.classList.add("fade-in");
    }, 500);
  }, 3000);
}

/**
 * 5. NAVBAR SCROLL EFFECT
 */
function initNavbarScroll() {
  const nav = document.getElementById("main-nav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      // On passe en mode sombre (fond blanc)
      nav.classList.remove("nav-transparent");
      nav.classList.add("nav-scrolled");
    } else {
      // On repasse en mode clair (fond transparent)
      nav.classList.remove("nav-scrolled");
      nav.classList.add("nav-transparent");
    }
  });
}

/**
 * 6. FAQ ACCORDION (Page Parents)
 */
function initFAQ() {
  const faqButtons = document.querySelectorAll(".faq-btn");
  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector(".faq-icon");
      if (!content || !icon) return;

      content.classList.toggle("hidden");
      icon.style.transform = content.classList.contains("hidden") 
        ? "rotate(0deg)" 
        : "rotate(180deg)";
    });
  });
}

/**
 * 7. PRÉ-SÉLECTION DE PROGRAMME (Via URL)
 * Exemple: enroll.html?program=soccer_group
 */
function preSelectProgram() {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedProgram = urlParams.get('program');

  if (selectedProgram) {
    const radioButton = document.querySelector(`input[name="program"][value="${selectedProgram}"]`);
    if (radioButton) {
      radioButton.checked = true;
      // Scroll optionnel vers la section programme pour confirmer visuellement
      radioButton.closest('label')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
