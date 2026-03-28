import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeroSlider();
  initDynamicText();
  initNavbarScroll();
  initFormsValidation();
  initFAQ();
});

// 1. Menu Mobile
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
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
}

export function initFormsValidation() {
  const forms = document.querySelectorAll(".needs-validation");

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]'); // On récupère le bouton

      if (!form.checkValidity()) {
        // ... (ton code SweetAlert warning actuel)
        return;
      }

      // --- DEBUT SYNCHRONISATION PRO ---
      submitBtn.disabled = true; // On désactive le bouton
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fa-solid fa-spinner animate-spin"></i> Sending...';
      // ---------------------------------

      Swal.fire({
        title: "Transmitting data...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const formData = {
        parent_name: document.getElementById("parentName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        child_name: document.getElementById("childName").value,
        child_age: parseInt(document.getElementById("childAge").value),
        diagnosis: document.getElementById("diagnosis").value || null,
        sensory_needs: document.getElementById("sensoryNeeds").value,
        program: document.querySelector('input[name="program"]:checked').value,
      };

      const { error } = await supabase.from("enrollments").insert([formData]);

      if (error) {
        // En cas d'erreur, on réactive le bouton pour laisser le parent corriger
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        console.error("Erreur Supabase:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Submission failed. Try again.",
        });
      } else {
        // Succès : SweetAlert s'occupe de la redirection
        Swal.fire({
          icon: "success",
          title: "Application Received!",
          confirmButtonColor: "#10b981",
        }).then(() => {
          form.reset();
          window.location.href = "/thank-you.html";
        });
      }
    });
  });
}
// 3. Slider
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

// 4. Texte dynamique
function initDynamicText() {
  const textElement = document.getElementById("dynamic-word");
  if (!textElement) return;
  const path = window.location.pathname;
  let words = ["Joy", "Inclusion", "Growth"];
  if (path.includes("programs"))
    words = ["Passion", "Skills", "Confidence", "Teamwork"];
  else if (path.includes("parents"))
    words = ["Safety", "Support", "Clarity", "Community"];
  else if (path.includes("about"))
    words = ["Mission", "Vision", "Purpose", "Community"];

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

// 5. Navbar scroll
function initNavbarScroll() {
  const nav = document.getElementById("main-nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.remove("nav-transparent", "py-4");
      nav.classList.add("nav-scrolled", "py-2");
      document
        .querySelectorAll(".nav-link")
        .forEach((el) => el.classList.remove("text-white"));
      document.querySelector(".logo-text").classList.remove("text-white");
    } else {
      nav.classList.add("nav-transparent", "py-4");
      nav.classList.remove("nav-scrolled", "py-2");
      document
        .querySelectorAll(".nav-link")
        .forEach((el) => el.classList.add("text-white"));
      document.querySelector(".logo-text").classList.add("text-white");
    }
  });
}

// 6. FAQ
function initFAQ() {
  const faqButtons = document.querySelectorAll(".faq-btn");
  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector(".faq-icon");
      content.classList.toggle("hidden");
      if (content.classList.contains("hidden"))
        icon.style.transform = "rotate(0deg)";
      else icon.style.transform = "rotate(180deg)";
    });
  });
}
