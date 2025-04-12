// cetak.js

import { fetchRegistrantById } from "/js/api.js";
import { formatDate } from "/js/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const registrantDataContainer = document.getElementById("registrant-data");

  // Ambil ID Registrasi dari localStorage
  const registrationId = localStorage.getItem("registrationId");

  if (!registrationId) {
    alert("ID Registrasi tidak ditemukan. Silakan login kembali.");
    window.location.href = "login.html"; // Redirect ke halaman login
    return;
  }

  try {
    // Fetch data pendaftar berdasarkan ID Registrasi
    const registrant = await fetchRegistrantById(registrationId);

    if (registrant && registrant.status !== "error") {
      // Format tanggal lahir
      const formattedTanggalLahir = formatDate(registrant["Tanggal Lahir"]);

      // Tampilkan data pendaftar
      registrantDataContainer.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-4">Data Pendaftaran</h3>
        <p><strong>NISN:</strong> ${registrant["NISN"]}</p>
        <p><strong>NIK:</strong> ${registrant["NIK"]}</p>
        <p><strong>Nama Lengkap:</strong> ${registrant["Nama Lengkap"]}</p>
        <p><strong>Tempat, Tanggal Lahir:</strong> ${registrant["Tempat Lahir"]}, ${formattedTanggalLahir}</p>
        <p><strong>Alamat:</strong> ${registrant["Alamat"]}</p>
        <p><strong>No. HP Siswa:</strong> ${registrant["No HP"]}</p>
        <p><strong>Nama Ayah:</strong> ${registrant["Nama Ayah"]}</p>
        <p><strong>Nama Ibu:</strong> ${registrant["Nama Ibu"]}</p>
        <p><strong>No. HP Ortu:</strong> ${registrant["No HP Ortu"]}</p>
        <p><strong>Asal Sekolah:</strong> ${registrant["Asal Sekolah"]}</p>
        <p><strong>Tahun Lulus:</strong> ${registrant["Tahun Lulus"]}</p>
        <p><strong>Status Verifikasi:</strong> ${registrant["Status Verifikasi"]}</p>
        <p><strong>ID Registrasi:</strong> ${registrant["ID Registrasi"]}</p>
      `;
    } else {
      alert("Data pendaftar tidak ditemukan. Silakan login kembali.");
      window.location.href = "login.html"; // Redirect ke halaman login
    }
  } catch (error) {
    console.error("Error fetching registrant data:", error);
    alert("Gagal memuat data pendaftar. Silakan coba lagi.");
    window.location.href = "login.html"; // Redirect ke halaman login
  }

  // Handle Print Button
  document.getElementById("print-button").addEventListener("click", () => {
    window.print(); // Trigger browser print dialog
  });
});