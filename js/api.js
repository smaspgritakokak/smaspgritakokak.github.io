const BASE_URL = "https://script.google.com/macros/s/AKfycbxHz_-u1sWm2fQ-XFEfTRxQHHeag82vtp-6gH-_iE40TH1CIS7hfnpuQUnZ1otvRLSZ/exec"; // Ganti dengan URL Web App kamu

async function postFormulir(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return await res.json();
}

async function getDashboardData() {
  const res = await fetch(`${BASE_URL}?func=getDashboard`);
  return await res.json();
}

async function getDataByID(id) {
  const res = await fetch(`${BASE_URL}?func=getDataByID&id=${id}`);
  return await res.json();
}

async function updateStatus(id, newStatus) {
  const res = await fetch(`${BASE_URL}?func=updateStatus&id=${id}&newStatus=${newStatus}`);
  return await res.json();
}

async function generatePDF(id) {
  const res = await fetch(`${BASE_URL}?func=generatePDF&id=${id}`);
  return await res.json();
}
