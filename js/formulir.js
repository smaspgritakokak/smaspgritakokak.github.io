// formulir.js

import { submitRegistration } from "/js/api.js";
import {
  validateNISN,
  validateNIK,
  validatePhoneNumber,
  validateGraduationYear,
  showError,
  hideError,
} from "/js/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");
  const nisnInput = document.getElementById("nisn");
  const nikInput = document.getElementById("nik");
  const namaInput = document.getElementById("nama");
  const tempatLahirInput = document.getElementById("tempat-lahir");
  const tanggalLahirInput = document.getElementById("tanggal-lahir");
  const alamatInput = document.getElementById("alamat");
  const hpSiswaInput = document.getElementById("hp-siswa");
  const namaAyahInput = document.getElementById("nama-ayah");
  const namaIbuInput = document.getElementById("nama-ibu");
  const hpOrtuInput = document.getElementById("hp-ortu");
  const asalSekolahInput = document.getElementById("asal-sekolah");
  const tahunLulusInput = document.getElementById("tahun-lulus");
  const genderInputs = document.querySelectorAll('input[name="gender"]');

  // Error message elements
  const nisnError = document.getElementById("nisn-error");
  const nikError = document.getElementById("nik-error");
  const hpSiswaError = document.getElementById("hp-siswa-error");
  const hpOrtuError = document.getElementById("hp-ortu-error");
  const tahunLulusError = document.getElementById("tahun-lulus-error");

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous errors
    hideError(nisnError);
    hideError(nikError);
    hideError(hpSiswaError);
    hideError(hpOrtuError);
    hideError(tahunLulusError);

    // Validate inputs
    let isValid = true;

    if (!validateNISN(nisnInput.value)) {
      showError(nisnError, "NISN harus terdiri dari 10 digit angka.");
      isValid = false;
    }

    if (!validateNIK(nikInput.value)) {
      showError(nikError, "NIK harus terdiri dari 16 digit angka.");
      isValid = false;
    }

    if (!validatePhoneNumber(hpSiswaInput.value)) {
      showError(hpSiswaError, "Nomor HP siswa harus terdiri dari 10-13 digit angka.");
      isValid = false;
    }

    if (!validatePhoneNumber(hpOrtuInput.value)) {
      showError(hpOrtuError, "Nomor HP orang tua harus terdiri dari 10-13 digit angka.");
      isValid = false;
    }

    if (!validateGraduationYear(tahunLulusInput.value)) {
      showError(
        tahunLulusError,
        "Tahun lulus harus antara 2000 dan tahun sekarang."
      );
      isValid = false;
    }

    if (!validateGender(selectedGender)) {
      showError(genderError, "Silakan pilih jenis kelamin yang valid.");
      isValid = false;
    }

    // If validation fails, stop submission
    if (!isValid) return;

    // Prepare form data
    const formData = {
      nisn: nisnInput.value,
      nik: nikInput.value,
      nama: namaInput.value,
      tempatLahir: tempatLahirInput.value,
      tanggalLahir: tanggalLahirInput.value,
      alamat: alamatInput.value,
      hpSiswa: hpSiswaInput.value,
      namaAyah: namaAyahInput.value,
      namaIbu: namaIbuInput.value,
      hpOrtu: hpOrtuInput.value,
      sekolahAsal: asalSekolahInput.value,
      tahunLulus: tahunLulusInput.value,
      gender: selectedGender.value,
    };

    try {
      // Submit data to backend
      const response = await submitRegistration(formData);

      if (response.status === "success") {
        alert("Pendaftaran berhasil! ID Registrasi Anda: " + response.id);
        window.location.href = "login.html"; // Redirect to login page
      } else {
        alert("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Gagal mengirim formulir. Silakan coba lagi.");
    }
  });
});
