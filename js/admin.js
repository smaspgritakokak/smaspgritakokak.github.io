// admin.js

import {
  fetchAllRegistrants,
  updateVerificationStatus,
  generateIndividualPDF,
  generateAllPDF,
} from "/js/api.js";
import { showError, hideError } from "/js/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const verificationIdInput = document.getElementById("verification-id");
  const printIndividualIdInput = document.getElementById("print-individual-id");
  const verifyButton = document.getElementById("verify-button");
  const printIndividualButton = document.getElementById("print-individual-button");
  const printAllButton = document.getElementById("print-all-button");
  const registrantsTableBody = document.getElementById("registrants-table-body");

  // Error message elements
  const verificationError = document.getElementById("verification-error");
  const printIndividualError = document.getElementById("print-individual-error");

  try {
    // Fetch all registrants and populate the table
    const registrants = await fetchAllRegistrants();
    registrantsTableBody.innerHTML = ""; // Clear existing rows

    registrants.forEach((registrant, index) => {
      const row = `
        <tr>
          <td class="py-2 px-4 border-b text-center">${index + 1}</td>
          <td class="py-2 px-4 border-b">${registrant["Nama Lengkap"]}</td>
          <td class="py-2 px-4 border-b">${registrant["Asal Sekolah"]}</td>
          <td class="py-2 px-4 border-b text-center">${registrant["Status Verifikasi"]}</td>
          <td class="py-2 px-4 border-b text-center">
            <button data-id="${registrant["ID Registrasi"]}" class="verify-btn bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-300">
              Verifikasi
            </button>
          </td>
        </tr>
      `;
      registrantsTableBody.insertAdjacentHTML("beforeend", row);
    });

    // Add event listeners for verification buttons in the table
    document.querySelectorAll(".verify-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
        try {
          const response = await updateVerificationStatus(id, "Terverifikasi");
          if (response.status === "success") {
            alert("Pendaftar berhasil diverifikasi!");
            window.location.reload(); // Refresh halaman
          }
        } catch (error) {
          console.error("Error verifying registrant:", error);
          alert("Gagal memverifikasi pendaftar. Silakan coba lagi.");
        }
      });
    });
  } catch (error) {
    console.error("Error fetching registrants:", error);
    alert("Gagal memuat data pendaftar. Silakan coba lagi.");
  }

  // Handle Verify Button
  verifyButton.addEventListener("click", async () => {
    const id = verificationIdInput.value.trim();

    // Validate input
    if (!id) {
      showError(verificationError, "ID Registrasi tidak boleh kosong.");
      return;
    }

    try {
      const response = await updateVerificationStatus(id, "Terverifikasi");
      if (response.status === "success") {
        alert("Pendaftar berhasil diverifikasi!");
        window.location.reload(); // Refresh halaman
      }
    } catch (error) {
      console.error("Error verifying registrant:", error);
      showError(verificationError, "Gagal memverifikasi pendaftar. Silakan coba lagi.");
    }
  });

  // Handle Print Individual Button
  printIndividualButton.addEventListener("click", async () => {
    const id = printIndividualIdInput.value.trim();

    // Validate input
    if (!id) {
      showError(printIndividualError, "ID Registrasi tidak boleh kosong.");
      return;
    }

    try {
      const pdfUrl = await generateIndividualPDF(id);
      window.open(pdfUrl, "_blank"); // Open PDF in a new tab
    } catch (error) {
      console.error("Error generating individual PDF:", error);
      showError(printIndividualError, "Gagal menghasilkan PDF. Silakan coba lagi.");
    }
  });

  // Handle Print All Button
  printAllButton.addEventListener("click", async () => {
    try {
      const pdfUrl = await generateAllPDF();
      window.open(pdfUrl, "_blank"); // Open PDF in a new tab
    } catch (error) {
      console.error("Error generating all PDF:", error);
      alert("Gagal menghasilkan PDF. Silakan coba lagi.");
    }
  });
});