    <!-- JAVASCRIPT LOGIC -->
    <script>
        // Data Global
        let isAuthenticated = false;
        let currentFilter = 'Semua';
        
        let portfolios = [
            {
                id: 1,
                title: "Otomasi Script Dashboard Admin",
                category: "Teknologi (Web & AI Prompting)",
                desc: "Pengembangan sistem web dashboard efisien dibantu dengan optimalisasi AI Prompting untuk analisis data.",
                link: ""
            },
            {
                id: 2,
                title: "Penelitian Kuantitatif Kebiasaan Belajar",
                category: "Prestasi Akademik",
                desc: "Riset metodologi kuantitatif MPI mengenai hubungan gaya belajar dan presisi akademik dengan alat uji SPSS.",
                link: "https://drive.google.com/preview"
            },
            {
                id: 3,
                title: "Komposisi Musik & Analisis Frekuensi",
                category: "Prestasi Non Akademik",
                desc: "Menggabungkan logika matematika dalam harmonisasi chord musik.",
                link: ""
            },
            {
                id: 4,
                title: "Sertifikasi Data Analytics (Google)",
                category: "Sertifikat Kemahiran Profesional",
                desc: "Penyelesaian program profesional untuk analisis data terstruktur dan visualisasi.",
                link: "https://drive.google.com/preview"
            }
        ];

        // 1. Navigasi & UI
        function toggleMobileMenu() {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        }

        function navigate(sectionId) {
            document.querySelectorAll('.section-page').forEach(sec => sec.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            window.scrollTo(0, 0);

            if(sectionId === 'portfolio') renderPortfolio();
            if(sectionId === 'edit') renderManageList();
        }

        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const msg = document.getElementById('contact-message').value;
            
            const subject = encodeURIComponent(`Pesan Portofolio dari ${name}`);
            const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${msg}`);
            
            window.location.href = `mailto:ahmadrijani207@gmail.com?subject=${subject}&body=${body}`;
            
            const msgEl = document.getElementById('contact-msg');
            msgEl.classList.remove('hidden');
            setTimeout(() => msgEl.classList.add('hidden'), 3000);
            this.reset();
        });

        // 2. Auth Logic (Manajemen Data)
        function requestEditAccess() {
            if (isAuthenticated) {
                navigate('edit');
            } else {
                document.getElementById('password-modal').classList.remove('hidden');
            }
        }

        function closePasswordModal() {
            document.getElementById('password-modal').classList.add('hidden');
            document.getElementById('auth-password').value = '';
            document.getElementById('auth-error').classList.add('hidden');
        }

        function verifyPassword() {
            const pw = document.getElementById('auth-password').value;
            const err = document.getElementById('auth-error');
            if (pw === '230101050652') {
                isAuthenticated = true;
                closePasswordModal();
                navigate('edit');
            } else {
                err.classList.remove('hidden');
            }
        }

        // Filter Logic
        function filterPortfolio(category) {
            currentFilter = category;
            
            // Ubah tampilan tombol aktif
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if(btn.innerText.includes(category.split(' ')[0]) || (category === 'Semua' && btn.innerText === 'Semua')) {
                    btn.classList.add('active');
                }
            });

            renderPortfolio();
        }

        // 3. Render Portofolio (Grid View)
        function renderPortfolio() {
            const grid = document.getElementById('portfolio-grid');
            grid.innerHTML = '';

            let filtered = currentFilter === 'Semua' 
                ? portfolios 
                : portfolios.filter(p => p.category === currentFilter);

            if(filtered.length === 0) {
                grid.innerHTML = '<p class="text-gray-400 col-span-full text-center py-10">Belum ada karya di kategori ini.</p>';
                return;
            }

            // Copy array untuk reverse agar yg baru di atas
            [...filtered].reverse().forEach(item => {
                let icon = 'fa-folder';
                if(item.category.includes('Teknologi')) icon = 'fa-laptop-code';
                if(item.category.includes('Akademik')) icon = 'fa-graduation-cap';
                if(item.category.includes('Sertifikat')) icon = 'fa-certificate';
                if(item.category.includes('Grafis')) icon = 'fa-palette';

                let linkHtml = item.link 
                    ? `<a href="${item.link}" target="_blank" class="inline-flex items-center gap-2 mt-4 text-xs font-semibold text-brand-accent hover:text-white transition-colors"><i class="fas fa-external-link-alt"></i> Preview Dokumen</a>` 
                    : '';

                const card = `
                    <div class="bg-brand-card rounded-2xl p-6 border border-gray-700 hover:border-brand-accent transition-all duration-300 hover:-translate-y-2 group shadow-lg flex flex-col h-full">
                        <div class="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-accent transition-colors">
                            <i class="fas ${icon} text-xl text-brand-primary group-hover:text-white"></i>
                        </div>
                        <span class="text-xs font-semibold px-2 py-1 bg-brand-dark text-brand-accent rounded-md mb-3 self-start">
                            ${item.category}
                        </span>
                        <h3 class="text-xl font-bold mb-2 text-white">${item.title}</h3>
                        <p class="text-gray-400 text-sm leading-relaxed flex-grow">
                            ${item.desc}
                        </p>
                        ${linkHtml}
                    </div>
                `;
                grid.innerHTML += card;
            });
        }

        // 4. Manajemen Data (CRUD)
        function renderManageList() {
            const list = document.getElementById('manage-list');
            list.innerHTML = '';

            if (portfolios.length === 0) {
                list.innerHTML = '<p class="text-gray-400 text-sm">Belum ada data.</p>';
                return;
            }

            [...portfolios].reverse().forEach(item => {
                list.innerHTML += `
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-brand-dark p-4 rounded-lg border border-gray-700 gap-4">
                        <div>
                            <h4 class="font-bold text-white">${item.title}</h4>
                            <p class="text-xs text-brand-accent">${item.category}</p>
                        </div>
                        <div class="flex gap-2 w-full md:w-auto">
                            <button onclick="editItem(${item.id})" class="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm transition-colors"><i class="fas fa-edit"></i> Edit</button>
                            <button onclick="deleteItem(${item.id})" class="flex-1 md:flex-none bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm transition-colors"><i class="fas fa-trash"></i> Hapus</button>
                        </div>
                    </div>
                `;
            });
        }

        // Handle Add & Edit Form Submit
        document.getElementById('add-portfolio-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const idInput = document.getElementById('p-id').value;
            const title = document.getElementById('p-title').value;
            const category = document.getElementById('p-category').value;
            const desc = document.getElementById('p-desc').value;
            const link = document.getElementById('p-link').value;

            if (idInput) {
                // Update exist data
                const index = portfolios.findIndex(p => p.id == idInput);
                if(index !== -1) {
                    portfolios[index] = { id: parseInt(idInput), title, category, desc, link };
                }
            } else {
                // Add new data
                portfolios.push({ id: Date.now(), title, category, desc, link });
            }

            // UI Feedback
            const msg = document.getElementById('form-msg');
            msg.classList.remove('hidden');
            setTimeout(() => msg.classList.add('hidden'), 3000);

            cancelEdit(); // Reset form & ui
            renderManageList();
            renderPortfolio();
        });

        function deleteItem(id) {
            // Kita bikin modal custom gantiin alert bawaan browser
            if(confirm("Yakin mau hapus data ini?")) {
                portfolios = portfolios.filter(p => p.id !== id);
                renderManageList();
                renderPortfolio();
            }
        }

        function editItem(id) {
            const item = portfolios.find(p => p.id === id);
            if(!item) return;

            document.getElementById('p-id').value = item.id;
            document.getElementById('p-title').value = item.title;
            document.getElementById('p-category').value = item.category;
            document.getElementById('p-desc').value = item.desc;
            document.getElementById('p-link').value = item.link || "";

            document.getElementById('form-title').innerHTML = "Edit Portofolio";
            document.getElementById('btn-submit').innerHTML = "Update Data";
            document.getElementById('btn-cancel').classList.remove('hidden');

            // Scroll up to form
            window.scrollTo({ top: document.getElementById('edit').offsetTop - 100, behavior: 'smooth' });
        }

        function cancelEdit() {
            document.getElementById('add-portfolio-form').reset();
            document.getElementById('p-id').value = '';
            document.getElementById('form-title').innerHTML = "Tambah Portofolio Baru";
            document.getElementById('btn-submit').innerHTML = "Simpan Data";
            document.getElementById('btn-cancel').classList.add('hidden');
        }

        // Init
        renderPortfolio();
    </script>
</body>
</html>
