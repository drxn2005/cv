// CV Builder - Enhanced Consolidated Script

// Merged all modules to avoid CORS issues with file:// protocol

// 1. Storage Module
const storage = {
    KEY: 'cv_builder_data',
    save(data) {
        try { localStorage.setItem(this.KEY, JSON.stringify(data)); } catch (e) { console.error(e); }
    },
    load() {
        try { return JSON.parse(localStorage.getItem(this.KEY)); } catch (e) { return null; }
    }
};

// 2. Themes Module
const themes = {
    current: 'blue',
    list: [
        { id: 'blue', color: '#1a73e8' },
        { id: 'gray', color: '#455a64' },
        { id: 'coral', color: '#ff6b6b' },
        { id: 'green', color: '#2e7d32' },
        { id: 'purple', color: '#7b1fa2' },
        { id: 'dark', color: '#3c4043' }
    ],
    init(onUpdate) {
        this.onUpdate = onUpdate;
        this.render();
    },
    render() {
        const picker = document.getElementById('theme-picker');
        if (!picker) return;
        picker.innerHTML = this.list.map(t => `
            <div class="theme-swatch ${t.id === this.current ? 'active' : ''}" 
                 data-theme="${t.id}" style="background-color: ${t.color}"></div>
        `).join('');
        picker.querySelectorAll('.theme-swatch').forEach(s => {
            s.addEventListener('click', () => {
                this.apply(s.dataset.theme);
                if (this.onUpdate) this.onUpdate();
            });
        });
    },
    apply(id, customColor = null) {
        this.current = id;
        document.documentElement.setAttribute('data-theme', id);
        if (id === 'custom' && customColor) {
            document.documentElement.style.setProperty('--primary', customColor);
            // Derive a light version for the sidebar
            document.documentElement.style.setProperty('--primary-light', customColor + '15'); // 15 is ~8% opacity
        } else {
            document.documentElement.style.removeProperty('--primary');
            document.documentElement.style.removeProperty('--primary-light');
        }
        this.render();
    }
};

const helpers = {
    getSocialStatus(val) {
        const map = { single: 'أعزب', married: 'متزوج', divorced: 'مطلق', widowed: 'أرمل' };
        return map[val] || val;
    },
    getMilitaryStatus(val) {
        const map = { exempted: 'إعفاء نهائي', postponed: 'تأجيل', completed: 'أدى الخدمة', 'not-required': 'غير مطلوب' };
        return map[val] || val;
    }
};

// 3. Templates Module
const templates = {
    renderProgressBar(label, value) {
        return `
            <div style="margin-bottom: 10px;">
                <div style="display:flex; justify-content:space-between; font-size: 0.85rem; margin-bottom: 2px;">
                    <span>${label}</span>
                    <span style="color:var(--primary); font-weight:700;">${value}%</span>
                </div>
                <div class="cv-progress-bar">
                    <div class="cv-progress-fill" style="width: ${value}%"></div>
                </div>
            </div>
        `;
    },
    modern(data) {
        return `
            <div class="modern-layout">
                <aside class="modern-sidebar" style="background-color: var(--primary-light);">
                    <div class="photo-box"><img src="${data.photo || ''}" alt=""></div>
                    
                    <section>
                        <h3 class="cv-section-title">المعلومات الشخصية</h3>
                        <div class="modern-contact-info">
                            ${data.age ? `<div><strong>العمر:</strong> ${data.age} سنة</div>` : ''}
                            ${data.socialStatus ? `<div><strong>الحالة:</strong> ${helpers.getSocialStatus(data.socialStatus)}</div>` : ''}
                            ${data.militaryStatus ? `<div><strong>التجنيد:</strong> ${helpers.getMilitaryStatus(data.militaryStatus)}</div>` : ''}
                        </div>
                    </section>

                    <section>
                        <h3 class="cv-section-title">التواصل</h3>
                        <div class="modern-contact-info">
                            <div style="display:flex;align-items:center;gap:8px"><i data-lucide="mail" style="width:14px"></i> ${data.email || ''}</div>
                            <div style="display:flex;align-items:center;gap:8px"><i data-lucide="phone" style="width:14px"></i> ${data.phone || ''}</div>
                            <div style="display:flex;align-items:center;gap:8px"><i data-lucide="map-pin" style="width:14px"></i> ${data.location || ''}</div>
                            ${data.linkedin ? `<div style="display:flex;align-items:center;gap:8px"><i data-lucide="linkedin" style="width:14px"></i> LinkedIn</div>` : ''}
                        </div>
                    </section>

                    <section>
                        <h3 class="cv-section-title">المهارات</h3>
                        <div>
                            ${(data.skills || []).map(s => this.renderProgressBar(s.name, s.level)).join('')}
                        </div>
                    </section>

                    <section>
                        <h3 class="cv-section-title">اللغات</h3>
                        <div>
                            ${(data.languages || []).map(l => this.renderProgressBar(l.name, l.level)).join('')}
                        </div>
                    </section>
                </aside>
                <main>
                    <h1 style="color:var(--primary);font-size:2.5rem">${data.name || 'الاسم الكامل'}</h1>
                    <h2 style="color:var(--text-muted);font-size:1.2rem">${data.jobTitle || 'المسمى الوظيفي'}</h2>
                    
                    <section style="margin-top:25px">
                        <h3 class="cv-section-title">النبذة الشخصية</h3>
                        <p style="text-align: justify;">${data.summary || ''}</p>
                    </section>

                    <section style="margin-top:25px">
                        <h3 class="cv-section-title">الخبرة العملية</h3>
                        ${(data.experience || []).map(e => `
                            <div class="cv-item">
                                <div style="display:flex;justify-content:space-between; align-items: baseline;">
                                    <strong style="font-size:1.1rem">${e.role}</strong> 
                                    <span style="color:var(--primary); font-weight:600;">${e.date}</span>
                                </div>
                                <div style="color:var(--primary); font-weight:600; margin-bottom:5px;">${e.company}</div>
                                <p style="font-size:0.9rem; text-align: justify;">${e.desc}</p>
                            </div>
                        `).join('')}
                    </section>

                    <section style="margin-top:25px">
                        <h3 class="cv-section-title">التعليم</h3>
                        ${(data.education || []).map(e => `
                            <div class="cv-item">
                                <div style="display:flex;justify-content:space-between">
                                    <strong>${e.degree}</strong> 
                                    <span style="color:var(--primary)">${e.date}</span>
                                </div>
                                <div>${e.school}</div>
                            </div>
                        `).join('')}
                    </section>
                    
                    ${data.lifeExp ? `
                    <section style="margin-top:25px">
                        <h3 class="cv-section-title">خبرات حياتية</h3>
                        <p>${data.lifeExp}</p>
                    </section>` : ''}
                </main>
            </div>
        `;
    },
    classic(data) {
        return `
            <div class="classic-layout">
                <header style="text-align:center;border-bottom:2px solid var(--primary);padding-bottom:15px;margin-bottom:25px">
                    <h1 style="color:var(--primary);font-size:2.5rem; margin-bottom:5px;">${data.name || ''}</h1>
                    <div style="font-size:1.1rem; color:var(--text-muted); margin-bottom:10px;">${data.jobTitle || ''}</div>
                    <div style="display:flex; justify-content:center; gap:15px; flex-wrap:wrap; font-size:0.9rem;">
                        <span>${data.email}</span> | <span>${data.phone}</span> | <span>${data.location}</span>
                    </div>
                </header>

                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:30px;">
                    <div>
                        <section>
                            <h3 class="cv-section-title">عني</h3>
                            <p>${data.summary}</p>
                        </section>

                        <section style="margin-top:25px">
                            <h3 class="cv-section-title">التاريخ المهني</h3>
                            ${(data.experience || []).map(e => `
                                <div class="cv-item">
                                    <div style="display:flex;justify-content:space-between"><strong>${e.role} @ ${e.company}</strong> <span>${e.date}</span></div>
                                    <p style="margin-top:5px;">${e.desc}</p>
                                </div>
                            `).join('')}
                        </section>
                    </div>
                    <div>
                        <section>
                            <h3 class="cv-section-title">معلومات</h3>
                            <div style="font-size:0.9rem; line-height:1.8;">
                                ${data.age ? `<div><strong>العمر:</strong> ${data.age}</div>` : ''}
                                ${data.socialStatus ? `<div><strong>الحالة:</strong> ${helpers.getSocialStatus(data.socialStatus)}</div>` : ''}
                                ${data.militaryStatus ? `<div><strong>التجنيد:</strong> ${helpers.getMilitaryStatus(data.militaryStatus)}</div>` : ''}
                            </div>
                        </section>

                        <section style="margin-top:25px">
                            <h3 class="cv-section-title">المهارات</h3>
                            ${(data.skills || []).map(s => this.renderProgressBar(s.name, s.level)).join('')}
                        </section>

                        <section style="margin-top:25px">
                            <h3 class="cv-section-title">اللغات</h3>
                            ${(data.languages || []).map(l => this.renderProgressBar(l.name, l.level)).join('')}
                        </section>
                    </div>
                </div>
            </div>
        `;
    },
    creative(data) {
        return `
            <div class="creative-layout">
                <header style="background:var(--primary);color:white;margin:-20mm -20mm 25px -20mm;padding:20mm;display:flex;justify-content:space-between;align-items:center">
                    <div>
                        <h1 style="font-size:3.5rem; margin:0">${data.name || ''}</h1>
                        <h3 style="font-weight:300; opacity:0.9">${data.jobTitle || ''}</h3>
                    </div>
                    <div style="width:140px;height:140px;background:white;border-radius:20px;padding:5px;overflow:hidden">
                        <img src="${data.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:15px">
                    </div>
                </header>
                <div style="display:grid;grid-template-columns:1fr 2fr;gap:40px">
                    <aside>
                        <section>
                            <h3 class="cv-section-title">معلومات</h3>
                            <div style="display:flex;flex-direction:column;gap:5px;font-size:0.9rem">
                                <div><i data-lucide="mail"></i> ${data.email}</div>
                                <div><i data-lucide="phone"></i> ${data.phone}</div>
                                ${data.age ? `<div>العمر: ${data.age}</div>` : ''}
                                ${data.socialStatus ? `<div>الحالة: ${helpers.getSocialStatus(data.socialStatus)}</div>` : ''}
                            </div>
                        </section>
                        <section style="margin-top:30px">
                            <h3 class="cv-section-title">المهارات</h3>
                            ${(data.skills || []).map(s => this.renderProgressBar(s.name, s.level)).join('')}
                        </section>
                        <section style="margin-top:30px">
                            <h3 class="cv-section-title">اللغات</h3>
                            ${(data.languages || []).map(l => this.renderProgressBar(l.name, l.level)).join('')}
                        </section>
                    </aside>
                    <main>
                        <section>
                            <h3 class="cv-section-title">القصة المهنية</h3>
                            ${(data.experience || []).map(e => `
                                <div class="cv-item" style="border-right:3px solid var(--primary-light); padding-right:15px; margin-bottom:20px">
                                    <strong style="display:block; font-size:1.1rem">${e.role}</strong>
                                    <small style="color:var(--primary); font-weight:700">${e.company} | ${e.date}</small>
                                    <p style="margin-top:8px">${e.desc}</p>
                                </div>
                            `).join('')}
                        </section>
                    </main>
                </div>
            </div>
        `;
    }
};

// 4. Form Module
const form = {
    init(onUpdate) {
        this.onUpdate = onUpdate;
        this.setupTabs();
        this.setupInputs();
        this.setupDynamicLists();
    },
    setupTabs() {
        const tabs = document.querySelector('.form-tabs');
        if (tabs) {
            tabs.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    tabs.scrollLeft += e.deltaY;
                }
            });
        }
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const pane = document.getElementById(btn.dataset.tab);
                if (pane) pane.classList.add('active');
            });
        });
    },
    setupInputs() {
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.addEventListener('input', () => this.onUpdate());
        });
    },
    setupDynamicLists() {
        document.querySelectorAll('.add-item').forEach(btn => {
            btn.addEventListener('click', () => this.addItem(btn.dataset.type));
        });
    },
    addItem(type, data = {}) {
        const list = document.getElementById(`${type}-list`);
        if (!list) return;
        const item = document.createElement('div');
        item.className = 'dynamic-item';
        let html = '';

        if (type === 'education') {
            html = `
                <div class="grid-2">
                    <div class="input-group"><label>الجامعة</label><input type="text" class="edu-school" placeholder="مثال: جامعة القاهرة" value="${data.school || ''}"></div>
                    <div class="input-group"><label>الدرجة العلمية</label><input type="text" class="edu-degree" placeholder="مثال: بكالوريوس حقوق" value="${data.degree || ''}"></div>
                </div>
                <div class="input-group"><label>الفترة الزمنية</label><input type="text" class="edu-date" placeholder="مثال: 2018 - 2022" value="${data.date || ''}"></div>`;
        } else if (type === 'experience') {
            html = `
                <div class="grid-2">
                    <div class="input-group"><label>الشركة / المكتب</label><input type="text" class="exp-company" placeholder="مثال: مكتب النيابة" value="${data.company || ''}"></div>
                    <div class="input-group"><label>المسمى الوظيفي</label><input type="text" class="exp-role" placeholder="مثال: محامي" value="${data.role || ''}"></div>
                </div>
                <div class="input-group"><label>الفترة الزمنية</label><input type="text" class="exp-date" placeholder="مثal: 2023 - الآن" value="${data.date || ''}"></div>
                <div class="input-group"><label>وصف المهام</label><textarea class="exp-desc" placeholder="تحدث عن مسئولياتك...">${data.desc || ''}</textarea></div>`;
        } else if (type === 'skills' || type === 'languages') {
            const prefix = type === 'skills' ? 'skill' : 'lang';
            html = `
                <div class="input-group">
                    <label>${type === 'skills' ? 'اسم المهارة' : 'اللغة'}</label>
                    <input type="text" class="${prefix}-name" placeholder="مثال: ${type === 'skills' ? 'إكسل' : 'الإنجليزية'}" value="${data.name || ''}">
                    <div class="proficiency-container">
                        <input type="range" class="${prefix}-level proficiency-slider" min="0" max="100" value="${data.level || 80}">
                        <span class="proficiency-val">${data.level || 80}%</span>
                    </div>
                </div>`;
        } else if (type === 'projects') {
            html = `
                <div class="input-group"><label>اسم المشروع</label><input type="text" class="proj-name" placeholder="مثال: نظام إدارة قضايا" value="${data.name || ''}"></div>
                <div class="input-group"><label>وصف المشروع</label><textarea class="proj-desc" placeholder="اشرح باختصار عن المشروع...">${data.desc || ''}</textarea></div>`;
        }

        item.innerHTML = html + `<button class="remove-item" title="حذف"><i data-lucide="trash-2"></i></button>`;

        // Handle Slider Update UI
        const slider = item.querySelector('.proficiency-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                item.querySelector('.proficiency-val').textContent = e.target.value + '%';
                this.onUpdate();
            });
        }

        item.querySelector('.remove-item').addEventListener('click', () => { item.remove(); this.onUpdate(); });
        item.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', () => this.onUpdate()));

        list.appendChild(item);
        lucide.createIcons();
        this.onUpdate();
    },
    getData() {
        return {
            name: document.getElementById('full-name')?.value || '',
            jobTitle: document.getElementById('job-title')?.value || '',
            birthDate: document.getElementById('birth-date')?.value || '',
            age: document.getElementById('age')?.value || '',
            socialStatus: document.getElementById('social-status')?.value || '',
            summary: document.getElementById('summary')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            location: document.getElementById('location')?.value || '',
            linkedin: document.getElementById('linkedin')?.value || '',
            militaryStatus: document.getElementById('military-status')?.value || '',
            lifeExp: document.getElementById('life-exp')?.value || '',
            photo: document.getElementById('photo-preview')?.src || '',
            skills: Array.from(document.querySelectorAll('#skills-list .dynamic-item')).map(it => ({
                name: it.querySelector('.skill-name').value,
                level: it.querySelector('.skill-level').value
            })),
            languages: Array.from(document.querySelectorAll('#languages-list .dynamic-item')).map(it => ({
                name: it.querySelector('.lang-name').value,
                level: it.querySelector('.lang-level').value
            })),
            education: Array.from(document.querySelectorAll('#education-list .dynamic-item')).map(it => ({
                school: it.querySelector('.edu-school').value,
                degree: it.querySelector('.edu-degree').value,
                date: it.querySelector('.edu-date').value
            })),
            experience: Array.from(document.querySelectorAll('#experience-list .dynamic-item')).map(it => ({
                company: it.querySelector('.exp-company').value,
                role: it.querySelector('.exp-role').value,
                date: it.querySelector('.exp-date').value,
                desc: it.querySelector('.exp-desc').value
            })),
            projects: Array.from(document.querySelectorAll('#projects-list .dynamic-item')).map(it => ({
                name: it.querySelector('.proj-name').value,
                desc: it.querySelector('.proj-desc').value
            }))
        };
    },
    setData(data) {
        if (!data) return;
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        setVal('full-name', data.name);
        setVal('job-title', data.jobTitle);
        setVal('birth-date', data.birthDate);
        setVal('age', data.age);
        setVal('social-status', data.socialStatus);
        setVal('summary', data.summary);
        setVal('email', data.email);
        setVal('phone', data.phone);
        setVal('location', data.location);
        setVal('linkedin', data.linkedin);
        setVal('military-status', data.militaryStatus);
        setVal('life-exp', data.lifeExp);

        if (data.photo && document.getElementById('photo-preview')) document.getElementById('photo-preview').src = data.photo;

        document.getElementById('education-list').innerHTML = '';
        (data.education || []).forEach(e => this.addItem('education', e));
        document.getElementById('experience-list').innerHTML = '';
        (data.experience || []).forEach(e => this.addItem('experience', e));
        document.getElementById('skills-list').innerHTML = '';
        (data.skills || []).forEach(s => this.addItem('skills', s));
        document.getElementById('languages-list').innerHTML = '';
        (data.languages || []).forEach(l => this.addItem('languages', l));
        document.getElementById('projects-list').innerHTML = '';
        (data.projects || []).forEach(p => this.addItem('projects', p));
    }
};

// 5. Drawing Module
const drawing = {
    init() {
        this.canvas = document.getElementById('drawing-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;

        document.getElementById('draw-btn').addEventListener('click', () => this.toggle());
        document.getElementById('close-draw').addEventListener('click', () => this.hide());
        document.getElementById('clear-draw').addEventListener('click', () => this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height));

        this.canvas.addEventListener('mousedown', (e) => this.start(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.isDrawing = false);

        this.resize();
    },
    resize() {
        const rect = document.getElementById('cv-preview').getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    },
    toggle() { if (this.canvas.hidden) this.show(); else this.hide(); },
    show() { this.canvas.hidden = false; document.getElementById('canvas-tools').hidden = false; this.resize(); },
    hide() { this.canvas.hidden = true; document.getElementById('canvas-tools').hidden = true; },
    start(e) {
        this.isDrawing = true;
        this.ctx.beginPath();
        const r = this.canvas.getBoundingClientRect();
        this.ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
    },
    draw(e) {
        if (!this.isDrawing) return;
        const r = this.canvas.getBoundingClientRect();
        this.ctx.lineTo(e.clientX - r.left, e.clientY - r.top);
        this.ctx.strokeStyle = document.getElementById('draw-color').value;
        this.ctx.lineWidth = document.getElementById('draw-size').value;
        this.ctx.stroke();
    }
};

// 6. Photo Module
const photo = {
    init(onUpdate) {
        const input = document.getElementById('photo-input');
        if (!input) return;
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.getElementById('photo-preview').src = ev.target.result;
                    if (onUpdate) onUpdate();
                };
                reader.readAsDataURL(file);
            }
        });
    }
};

// 7. Exporter Module
const exporter = {
    async run(type) {
        const el = document.getElementById('cv-preview');
        const draw = document.getElementById('drawing-canvas');
        const canvas = await html2canvas(el, { scale: 2 });
        if (!draw.hidden) {
            canvas.getContext('2d').drawImage(draw, 0, 0, canvas.width, canvas.height);
        }
        if (type === 'pdf') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const w = pdf.internal.pageSize.getWidth();
            const h = (canvas.height * w) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h);
            pdf.save('cv.pdf');
        } else {
            const link = document.createElement('a');
            link.download = 'cv.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        }
    }
};

// 8. App Controller
class App {
    constructor() {
        this.template = 'modern';
    }
    init() {
        form.init(() => this.update());
        themes.init(() => this.update());
        photo.init(() => this.update());
        drawing.init();

        const saved = storage.load();
        if (saved) {
            form.setData(saved);
            this.template = saved.template || 'modern';
            document.getElementById('template-select').value = this.template;
            // If a custom color was saved, apply it
            if (saved.theme === 'custom' && saved.customColor) {
                themes.apply(saved.theme, saved.customColor);
                const customPicker = document.getElementById('custom-theme-color');
                if (customPicker) customPicker.value = saved.customColor;
            } else {
                themes.apply(saved.theme || 'blue');
            }
        } else {
            form.addItem('experience');
            form.addItem('education');
        }

        document.getElementById('template-select').addEventListener('change', (e) => {
            this.template = e.target.value;
            this.update();
        });

        const customPicker = document.getElementById('custom-theme-color');
        if (customPicker) {
            customPicker.addEventListener('input', (e) => {
                themes.apply('custom', e.target.value);
                this.update();
            });
        }

        document.getElementById('export-pdf').addEventListener('click', () => exporter.run('pdf'));
        document.getElementById('export-jpg').addEventListener('click', () => exporter.run('jpg'));

        this.update();
    }
    update() {
        const data = form.getData();
        const html = templates[this.template](data);
        const container = document.getElementById('cv-preview');
        if (container) {
            container.innerHTML = html;
            lucide.createIcons();
        }
        // Save custom color if 'custom' theme is active
        const customColor = themes.current === 'custom' ? document.getElementById('custom-theme-color')?.value : undefined;
        storage.save({ ...data, template: this.template, theme: themes.current, customColor: customColor });
    }
}

window.addEventListener('load', () => {
    new App().init();
});
