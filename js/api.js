// api.js

const API_BASE_URL = "https://script.google.com/macros/s/AKfycbyLbzVLn963aoDdWaDj0G30D5vvMCk3ik1_wHcxD7G0EzzhY8LhrV2ZnmlG3MV83SqW/exec"; // Ganti dengan URL deploy Google Apps Script Anda

/**
 * Fungsi untuk mengambil semua data pendaftar dari backend.
 * @returns {Promise<Array>} - Array objek data pendaftar.
 */
export async function fetchAllRegistrants() {
  try {
    const response = await fetch(`${API_BASE_URL}?action=getAll`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching registrants:", error);
    throw error;
  }
}

/**
 * Fungsi untuk mengirim data pendaftaran baru ke backend.
 * @param {Object} formData - Data formulir pendaftaran.
 * @returns {Promise<Object>} - Respons dari backend.
 */
export async function submitRegistration(formData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error submitting registration:", error);
    throw error;
  }
}

/**
 * Fungsi untuk mengambil data pendaftar berdasarkan ID.
 * @param {string} id - ID unik pendaftar.
 * @returns {Promise<Object>} - Data pendaftar.
 */
export async function fetchRegistrantById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}?action=getById&id=${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching registrant by ID:", error);
    throw error;
  }
}

/**
 * Fungsi untuk memperbarui status verifikasi pendaftar.
 * @param {string} id - ID unik pendaftar.
 * @param {string} status - Status baru (misalnya "Terverifikasi").
 * @returns {Promise<Object>} - Respons dari backend.
 */
export async function updateVerificationStatus(id, status) {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateStatus",
        id: id,
        status: status,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating verification status:", error);
    throw error;
  }
}

/**
 * Fungsi untuk menghasilkan PDF individu berdasarkan ID.
 * @param {string} id - ID unik pendaftar.
 * @returns {Promise<string>} - URL PDF yang dihasilkan.
 */
export async function generateIndividualPDF(id) {
  try {
    const response = await fetch(`${API_BASE_URL}?action=generatePDF&id=${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.pdfUrl; // URL file PDF
  } catch (error) {
    console.error("Error generating individual PDF:", error);
    throw error;
  }
}

/**
 * Fungsi untuk menghasilkan PDF semua pendaftar.
 * @returns {Promise<string>} - URL PDF yang dihasilkan.
 */
export async function generateAllPDF() {
  try {
    const response = await fetch(`${API_BASE_URL}?action=generateAllPDF`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.pdfUrl; // URL file PDF
  } catch (error) {
    console.error("Error generating all PDF:", error);
    throw error;
  }
}
