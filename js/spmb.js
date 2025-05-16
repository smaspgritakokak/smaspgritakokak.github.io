    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPDwfC_hXybFzSTiQzxmOUGjtEjNiRjBta_X54zh6N55aaK67PdLGBaGHQ1OaoeoWq/exec';
    
    // Daftar section yang valid
    const validSections = ['landing', 'info', 'form', 'check', 'dashboard'];
    
    // Load tahun ajaran saat form dibuka
    function loadAcademicYear() {
      fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getCurrentAcademicYear'
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data) {
          document.getElementById('tahun_ajaran').value = data;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showErrorAlert('Gagal memuat tahun ajaran');
      });
    }
    
    // Tampilkan halaman berdasarkan parameter URL saat halaman dimuat
    window.onload = function() {
      const urlParams = new URLSearchParams(window.location.search);
      let page = urlParams.get('page') || 'landing';
      
      // Validasi section
      if (!validSections.includes(page)) {
        console.warn(`Invalid section: ${page}. Defaulting to landing.`);
        page = 'landing';
        // Update URL to reflect the default section
        const baseUrl = window.location.pathname;
        window.history.replaceState({}, '', `${baseUrl}?page=landing`);
      }
      showSection(page);
      
      // Cek jika ada parameter nomor pendaftaran (untuk deep link)
      const nomor = urlParams.get('nomor');
      if (nomor && page === 'check') {
        document.getElementById('check-nomor').value = nomor;
        setTimeout(() => checkStatus(), 500);
      }
      
      // Load tahun ajaran saat form pendaftaran dibuka
      if (page === 'form') {
        loadAcademicYear();
      }
    };
    
    // Fungsi toggle mobile menu
    function toggleMobileMenu() {
      const nav = document.getElementById('main-nav');
      nav.classList.toggle('hidden');
    }
    
    // Fungsi untuk menampilkan section tanpa reload penuh
    function showSection(section) {
      // Validasi section
      if (!validSections.includes(section)) {
        console.warn(`Invalid section: ${section}. Defaulting to landing.`);
        section = 'landing';
        // Update URL to reflect the default section
        const baseUrl = window.location.pathname;
        window.history.replaceState({}, '', `${baseUrl}?page=landing`);
      }
    
      // Sembunyikan semua section
      document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    
      // Tampilkan section yang diminta
      const targetSection = document.getElementById(`${section}-section`);
      if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Jika form pendaftaran, load tahun ajaran
        if (section === 'form') {
          loadAcademicYear();
        }
      } else {
        console.error(`Section element not found: ${section}-section`);
        // Fallback ke landing jika section tidak ditemukan
        document.getElementById('landing-section').classList.remove('hidden');
      }
    
      // Sembunyikan landing jika bukan landing
      const landingSection = document.getElementById('landing-section');
      if (section !== 'landing' && landingSection) {
        landingSection.classList.add('hidden');
      }
    
      // Update URL tanpa reload
      const baseUrl = window.location.pathname;
      window.history.pushState({}, '', `${baseUrl}?page=${section}`);
      
      // Sembunyikan mobile menu jika terbuka
      document.getElementById('main-nav').classList.add('hidden');
      
      // Scroll ke atas
      window.scrollTo(0, 0);
    }
    
    // Handle browser back/forward buttons
    window.onpopstate = function() {
      const urlParams = new URLSearchParams(window.location.search);
      let page = urlParams.get('page') || 'landing';
      
      // Validasi section
      if (!validSections.includes(page)) {
        console.warn(`Invalid section: ${page}. Defaulting to landing.`);
        page = 'landing';
        const baseUrl = window.location.pathname;
        window.history.replaceState({}, '', `${baseUrl}?page=landing`);
      }
      showSection(page);
    };
    
    // Fungsi Pratinjau
    function previewForm() {
      const form = document.getElementById('registration-form');
      const formData = new FormData(form);
      
      // Validasi form sebelum pratinjau
      let isValid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value) {
          isValid = false;
          input.style.borderColor = 'var(--danger)';
        } else {
          input.style.borderColor = '';
        }
      });
      
      if (!isValid) {
        showErrorAlert('Harap lengkapi semua field yang wajib diisi!');
        return;
      }
      
      let previewHtml = `
        <h4 style="margin-bottom: 1rem; font-weight: 600; color: var(--primary-dark);">
          <i class="fas fa-user-check"></i> Data Pendaftaran
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
      `;
      
      // Buat array dari formData untuk diurutkan
      const formEntries = Array.from(formData.entries());
      
      // Urutkan berdasarkan urutan field yang diinginkan
      const fieldOrder = [
        'jenis_pendaftaran', 'tahun_ajaran', 'nisn', 'nik', 'nama', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
        'agama', 'whatsapp', 'alamat', 'nama_ayah', 'pekerjaan_ayah', 'nama_ibu', 'pekerjaan_ibu', 'whatsapp_ortu', 'asal_sekolah', 'tahun_lulus'
      ];
      
      formEntries.sort((a, b) => {
        return fieldOrder.indexOf(a[0]) - fieldOrder.indexOf(b[0]);
      });
      
      // Bangun HTML untuk pratinjau
      formEntries.forEach(([key, value]) => {
        const label = document.querySelector(`label[for="${key}"]`).textContent;
        previewHtml += `
          <div style="margin-bottom: 0.5rem;">
            <strong style="font-size: 0.85rem; color: var(--gray);">${label.replace(' *', '')}:</strong>
            <p style="margin-top: 0.25rem;">${value || '-'}</p>
          </div>
        `;
      });
      
      document.getElementById('preview-content').innerHTML = previewHtml;
      document.getElementById('preview-section').classList.remove('hidden');
      form.classList.add('hidden');
    }
    
    // Fungsi Edit
    function editForm() {
      document.getElementById('preview-section').classList.add('hidden');
      document.getElementById('registration-form').classList.remove('hidden');
    }
    
    // Fungsi Submit
    function submitForm() {
      const submitBtn = document.getElementById('submit-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner"></span> Memproses...';
      submitBtn.disabled = true;
      
      // Kumpulkan data form
      const form = document.getElementById('registration-form');
      const formData = new FormData(form);
      const formObject = {};
      formData.forEach((value, key) => formObject[key] = value);
      
      // Kirim data ke Google Apps Script
      fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submitForm',
          formData: formObject
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Tampilkan SweetAlert sukses
          Swal.fire({
            title: 'Pendaftaran Berhasil!',
            html: `
              <div style="text-align: left;">
                <p><strong>Nomor Pendaftaran:</strong> ${data.nomorPendaftaran}</p>
                <p><strong>Tahun Ajaran:</strong> ${data.tahun_ajaran}</p>
                <p class="mt-3">Silakan simpan nomor pendaftaran ini untuk mengecek status pendaftaran.</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-success'
            },
            buttonsStyling: false
          }).then(() => {
            // Reset form
            form.reset();
            // Tampilkan section landing
            showSection('landing');
          });
        } else {
          showErrorAlert(data.message || 'Gagal menyimpan data');
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showErrorAlert('Terjadi kesalahan saat mengirim data');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
    }
    
    // Fungsi untuk langsung ke cek status dengan nomor tertentu
    function showCheckStatus(nomor) {
      showSection('check');
      document.getElementById('check-nomor').value = nomor;
      checkStatus();
    }
    
    // Fungsi Cek Status
    function checkStatus() {
      const checkBtn = document.getElementById('check-btn');
      const originalText = checkBtn.innerHTML;
      checkBtn.innerHTML = '<span class="spinner"></span> Mencari...';
      checkBtn.disabled = true;
      
      const nomor = document.getElementById('check-nomor').value.trim();
      const nisn = document.getElementById('check-nisn').value.trim();
      
      if (!nomor || !nisn) {
        showErrorAlert('Harap isi nomor pendaftaran dan NISN!');
        checkBtn.innerHTML = originalText;
        checkBtn.disabled = false;
        return;
      }
      
      // Kirim permintaan ke Google Apps Script
      fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'checkStatus',
          nomor: nomor,
          nisn: nisn
        })
      })
      .then(response => response.json())
      .then(data => {
        const resultDiv = document.getElementById('check-result');
        
        if (data.success && data.found) {
          let statusClass = '';
          if (data.data.status_verifikasi === 'Diverifikasi') {
            statusClass = 'status-verified';
          } else if (data.data.status_verifikasi === 'Ditolak') {
            statusClass = 'status-rejected';
          } else {
            statusClass = 'status-pending';
          }
          
          resultDiv.innerHTML = `
            <div class="card">
              <h4 style="margin-bottom: 1rem; color: var(--primary-dark);">
                <i class="fas fa-user-graduate"></i> Status Pendaftaran
              </h4>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div>
                  <strong style="font-size: 0.85rem; color: var(--gray);">Nomor Pendaftaran:</strong>
                  <p style="margin-top: 0.25rem;">${data.data.nomor}</p>
                </div>
                <div>
                  <strong style="font-size: 0.85rem; color: var(--gray);">Nama:</strong>
                  <p style="margin-top: 0.25rem;">${data.data.nama}</p>
                </div>
                <div>
                  <strong style="font-size: 0.85rem; color: var(--gray);">Asal Sekolah:</strong>
                  <p style="margin-top: 0.25rem;">${data.data.asal_sekolah}</p>
                </div>
                <div>
                  <strong style="font-size: 0.85rem; color: var(--gray);">Tanggal Daftar:</strong>
                  <p style="margin-top: 0.25rem;">${data.data.timestamp}</p>
                </div>
                <div>
                  <strong style="font-size: 0.85rem; color: var(--gray);">Status:</strong>
                  <p style="margin-top: 0.25rem;" class="${statusClass}">
                    <i class="fas fa-${data.data.status_verifikasi === 'Diverifikasi' ? 'check-circle' : 
                      data.data.status_verifikasi === 'Ditolak' ? 'times-circle' : 'clock'}"></i>
                    ${data.data.status_verifikasi}
                  </p>
                </div>
              </div>
              
              ${data.data.status_verifikasi === 'Diverifikasi' ? `
                <div class="alert alert-success mt-3">
                  <strong><i class="fas fa-check-circle"></i> Selamat!</strong> 
                  Anda diterima di SMAS PGRI TAKOKAK. Silakan lakukan daftar ulang sesuai jadwal.
                </div>
              ` : data.data.status_verifikasi === 'Ditolak' ? `
                <div class="alert alert-danger mt-3">
                  <strong><i class="fas fa-times-circle"></i> Maaf</strong>, 
                  Anda belum diterima di SMAS PGRI TAKOKAK.
                </div>
              ` : `
                <div class="alert alert-info mt-3">
                  <strong><i class="fas fa-info-circle"></i> Proses Verifikasi</strong> 
                  Pendaftaran Anda sedang dalam proses verifikasi. Silakan cek kembali beberapa hari lagi.
                </div>
              `}
              
              <div class="action-buttons mt-3">
                <button onclick="window.print()" class="btn btn-secondary">
                  <i class="fas fa-print"></i> Cetak
                </button>
                <button onclick="showSection('landing')" class="btn btn-primary">
                  <i class="fas fa-home"></i> Kembali
                </button>
              </div>
            </div>
          `;
        } else {
          resultDiv.innerHTML = `
            <div class="alert alert-danger">
              <strong><i class="fas fa-exclamation-triangle"></i> Data tidak ditemukan</strong>
              <p class="mt-2">Nomor pendaftaran atau NISN yang Anda masukkan tidak valid. Silakan coba lagi.</p>
            </div>
          `;
        }
        
        resultDiv.classList.remove('hidden');
        checkBtn.innerHTML = originalText;
        checkBtn.disabled = false;
      })
      .catch(error => {
        console.error('Error:', error);
        showErrorAlert('Terjadi kesalahan saat memeriksa status');
        checkBtn.innerHTML = originalText;
        checkBtn.disabled = false;
      });
    }
    
    // Fungsi Login Admin
    function adminLogin() {
      const loginBtn = document.getElementById('admin-login-btn');
      const originalText = loginBtn.innerHTML;
      loginBtn.innerHTML = '<span class="spinner"></span> Memverifikasi...';
      loginBtn.disabled = true;
      
      const username = document.getElementById('admin-username').value;
      const password = document.getElementById('admin-password').value;
      
      if (!username || !password) {
        showErrorAlert('Harap isi username dan password!');
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
        return;
      }
      
      // Kirim permintaan login ke Google Apps Script
      fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'adminLogin',
          username: username,
          password: password
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Jika login berhasil, load dashboard admin
          loadAdminDashboard();
          document.getElementById('login-form').classList.add('hidden');
          document.getElementById('admin-content').classList.remove('hidden');
          
          // Tampilkan notifikasi sukses
          showSuccessAlert('Login berhasil!');
        } else {
          showErrorAlert(data.message || 'Login gagal. Periksa kembali username dan password Anda.');
        }
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
      })
      .catch(error => {
        console.error('Error:', error);
        showErrorAlert('Terjadi kesalahan saat login');
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
      });
    }
    
    // Fungsi Load Admin Dashboard
    function loadAdminDashboard() {
      // Kirim permintaan untuk mendapatkan data pendaftaran
      fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getAllRegistrations'
        })
      })
      .then(response => response.json())
      .then(data => {
        const adminContent = document.getElementById('admin-content');
        
        if (data.success) {
          // Buat tabel data pendaftar
          let tableHtml = `
            <div class="info-section">
            <div class="table-responsive">
                <table id="admin-registrations-tab" class="info-table">
                  <thead>
                    <tr>
                      <th>No. Pendaftaran</th>
                      <th>Nama</th>
                      <th>Asal Sekolah</th>
                      <th>Tanggal Daftar</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
          `;
          
          data.data.forEach(reg => {
            let statusClass = '';
            if (reg.status_verifikasi === 'Diverifikasi') {
              statusClass = 'status-verified';
            } else if (reg.status_verifikasi === 'Ditolak') {
              statusClass = 'status-rejected';
            } else {
              statusClass = 'status-pending';
            }
            
            tableHtml += `
              <tr>
                <td>${reg.nomor}</td>
                <td>${reg.nama}</td>
                <td>${reg.asal_sekolah}</td>
                <td>${reg.timestamp}</td>
                <td class="${statusClass}">${reg.status_verifikasi}</td>
                <td>
                  <select onchange="updateStatus('${reg.nomor}', this.value)" 
                    style="padding: 0.25rem; border-radius: 4px; border: 1px solid var(--light-gray);">
                    <option value="Belum Diverifikasi" ${reg.status_verifikasi === 'Belum Diverifikasi' ? 'selected' : ''}>
                      Belum Diverifikasi
                    </option>
                    <option value="Diverifikasi" ${reg.status_verifikasi === 'Diverifikasi' ? 'selected' : ''}>
                      Diverifikasi
                    </option>
                    <option value="Ditolak" ${reg.status_verifikasi === 'Ditolak' ? 'selected' : ''}>
                      Ditolak
                    </option>
                  </select>
                </td>
              </tr>
            `;
          });
          
          tableHtml += `
                </tbody>
              </table>
            </div>
            <div class="action-buttons mt-3">
              <button onclick="exportToExcel()" class="btn btn-outline">
                <i class="fas fa-file-excel"></i> Export ke Excel
              </button>         
              <button onclick="showSection('landing')" class="btn btn-danger">
                <i class="fas fa-sign-out-alt"></i> Logout
              </button>       
            </div>
          `;
          
          adminContent.innerHTML = tableHtml;
        } else {
          adminContent.innerHTML = `
            <div class="alert alert-danger">
              <strong>Gagal memuat data:</strong> ${data.message}
            </div>
          `;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('admin-content').innerHTML = `
          <div class="alert alert-danger">
            <strong>Terjadi kesalahan saat memuat data</strong>
          </div>
        `;
      });
    }
    
    // Fungsi Update Status
    function updateStatus(nomor, status) {
      fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateStatus',
          nomor: nomor,
          status: status
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Tampilkan notifikasi sukses
          Swal.fire({
            title: 'Berhasil!',
            text: 'Status pendaftaran berhasil diperbarui',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-success'
            },
            buttonsStyling: false,
            timer: 2000,
            timerProgressBar: true
          });
        } else {
          showErrorAlert('Gagal memperbarui status: ' + (data.message || 'Unknown error'));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showErrorAlert('Terjadi kesalahan saat memperbarui status');
      });
    }
    
    // Fungsi Export ke Excel
    function exportToExcel() {
      Swal.fire({
        title: 'Sedang memproses...',
        html: 'Mempersiapkan file Excel untuk diunduh',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'exportData'
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          Swal.fire({
            title: 'Berhasil!',
            html: 'File Excel siap diunduh',
            icon: 'success',
            confirmButtonText: 'Unduh Sekarang',
            customClass: {
              confirmButton: 'btn btn-success'
            },
            buttonsStyling: false
          }).then(() => {
            // Buka URL download di tab baru
            window.open(data.downloadUrl, '_blank');
          });
        } else {
          showErrorAlert('Gagal mengekspor data: ' + (data.message || 'Unknown error'));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showErrorAlert('Terjadi kesalahan saat mengekspor data');
      });
    }
    
    // Fungsi untuk menampilkan alert sukses
    function showSuccessAlert(message) {
      Swal.fire({
        title: 'Berhasil!',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-success'
        },
        buttonsStyling: false
      });
    }
    
    // Fungsi untuk menampilkan alert error
    function showErrorAlert(message) {
      Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-danger'
        },
        buttonsStyling: false
      });
    }