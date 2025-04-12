// utils.js

/**
 * Fungsi untuk memformat tanggal ke format lokal (dd/mm/yyyy).
 * @param {string} date - Tanggal dalam format ISO (yyyy-mm-dd) atau objek Date.
 * @returns {string} - Tanggal yang diformat (dd/mm/yyyy).
 */
export function formatDate(date) {
  if (!date) return ""; // Jika tanggal kosong, kembalikan string kosong
  const parsedDate = new Date(date);
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
  const year = parsedDate.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Fungsi untuk memvalidasi NIK.
 * @param {string} nik - Nomor Induk Kependudukan.
 * @returns {boolean} - True jika NIK valid, false jika tidak.
 */
export function validateNIK(nik) {
  const nikRegex = /^[0-9]{16}$/; // NIK harus terdiri dari 16 digit angka
  return nikRegex.test(nik);
}

/**
 * Fungsi untuk memvalidasi NISN.
 * @param {string} nisn - Nomor Induk Siswa Nasional.
 * @returns {boolean} - True jika NISN valid, false jika tidak.
 */
export function validateNISN(nisn) {
  const nisnRegex = /^[0-9]{10}$/; // NISN harus terdiri dari 10 digit angka
  return nisnRegex.test(nisn);
}

/**
 * Fungsi untuk memvalidasi nomor HP.
 * @param {string} phoneNumber - Nomor HP.
 * @returns {boolean} - True jika nomor HP valid, false jika tidak.
 */
export function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^[0-9]{10,13}$/; // Nomor HP harus terdiri dari 10-13 digit angka
  return phoneRegex.test(phoneNumber);
}

/**
 * Fungsi untuk memvalidasi tahun lulus.
 * @param {string} graduationYear - Tahun lulus.
 * @returns {boolean} - True jika tahun lulus valid, false jika tidak.
 */
export function validateGraduationYear(graduationYear) {
  const currentYear = new Date().getFullYear();
  const year = parseInt(graduationYear, 10);
  return year >= 2000 && year <= currentYear; // Tahun lulus harus antara 2000 dan tahun sekarang
}

/**
 * Fungsi untuk menghasilkan ID unik.
 * @returns {string} - ID unik dalam format UUID v4.
 */
export function generateUniqueId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Fungsi untuk menampilkan pesan kesalahan pada elemen DOM tertentu.
 * @param {HTMLElement} element - Elemen DOM tempat pesan akan ditampilkan.
 * @param {string} message - Pesan kesalahan.
 */
export function showError(element, message) {
  element.textContent = message;
  element.classList.remove("hidden");
  element.classList.add("text-red-500", "text-sm", "mt-1");
}

/**
 * Fungsi untuk menyembunyikan pesan kesalahan.
 * @param {HTMLElement} element - Elemen DOM tempat pesan akan disembunyikan.
 */
export function hideError(element) {
  element.textContent = "";
  element.classList.add("hidden");
}