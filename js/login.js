// login.js

import { fetchRegistrantById } from "/js/api.js";
import { showError, hideError } from "/js/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const registrationIdInput = document.getElementById("registration-id");
  const errorElement = document.getElementById("registration-error");

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous errors
    hideError(errorElement);

    const registrationId = registrationIdInput.value.trim();

    // Validate input
    if (!registrationId) {
      showError(errorElement, "ID Registrasi tidak boleh kosong.");
      return;
    }

    try {
      // Fetch registrant data by ID
      const registrant = await fetchRegistrantById(registrationId);

      if (registrant && registrant.status !== "error") {
        // Save registration ID to localStorage and redirect to cetak.html
        localStorage.setItem("registrationId", registrationId);
        alert(`Selamat datang, ${registrant["Nama Lengkap"]}!`);
        window.location.href = "cetak.html"; // Redirect to cetak page
      } else {
        showError(errorElement, "ID Registrasi tidak ditemukan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      showError(errorElement, "Gagal memproses login. Silakan coba lagi.");
    }
  });
});