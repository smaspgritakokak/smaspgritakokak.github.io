document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch data pendaftar dari API
    const response = await fetch("/api"); // Endpoint API
    const data = await response.json();

    // Hitung statistik
    const totalPendaftar = data.length;
    const verifiedPendaftar = data.filter(p => p.StatusVerifikasi === "Terverifikasi").length;
    const unverifiedPendaftar = data.filter(p => p.StatusVerifikasi === "Belum Diverifikasi").length;

    // Update statistik di DOM
    document.getElementById("total-pendaftar").textContent = totalPendaftar;
    document.getElementById("verified-pendaftar").textContent = verifiedPendaftar;
    document.getElementById("unverified-pendaftar").textContent = unverifiedPendaftar;

    // Proses data untuk tabel
    const schoolData = {};
    data.forEach(pendaftar => {
      const school = pendaftar["Asal Sekolah"];
      if (!schoolData[school]) {
        schoolData[school] = 0;
      }
      schoolData[school]++;
    });

    // Generate tabel
    const tableBody = document.getElementById("school-table-body");
    let counter = 1;
    for (const [school, count] of Object.entries(schoolData)) {
      const row = `
        <tr>
          <td class="py-2 px-4 border-b text-center">${counter++}</td>
          <td class="py-2 px-4 border-b">${school}</td>
          <td class="py-2 px-4 border-b text-center">${count}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Gagal memuat data. Silakan coba lagi nanti.");
  }
});