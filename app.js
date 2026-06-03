class EventCapacityApp {
    constructor() {
        this.eventData = {
            title: '',
            maxCapacity: 0,
            accesses: []
        };
        
        this.counters = {};
        this.currentAccessId = null;
        
        this.loadFromLocalStorage();
        this.initEventListeners();
    }

    initEventListeners() {
        const form = document.getElementById('configForm');
        const numAccessInput = document.getElementById('numAccess');

        form.addEventListener('submit', (e) => this.handleConfigSubmit(e));
        numAccessInput.addEventListener('change', () => this.renderAccessInputs());
    }

    renderAccessInputs() {
        const numAccess = parseInt(document.getElementById('numAccess').value) || 0;
        const container = document.getElementById('accessesContainer');

        if (numAccess <= 0) {
            container.innerHTML = '';
            return;
        }

        let html = '<h3>Nombres de los Accesos</h3>';
        for (let i = 0; i < numAccess; i++) {
            const defaultName = this.eventData.accesses[i]?.name || `Acceso ${i + 1}`;
            html += `
                <div class="access-input-group">
                    <label style="min-width: 100px;">Acceso ${i + 1}</label>
                    <input type="text" class="access-name-input" data-index="${i}" value="${defaultName}" placeholder="Ej: Entrada Principal">
                </div>
            `;
        }

        container.innerHTML = html;
    }

    handleConfigSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('eventTitle').value.trim();
        const maxCapacity = parseInt(document.getElementById('maxCapacity').value);
        const numAccess = parseInt(document.getElementById('numAccess').value);

        if (!title || !maxCapacity || !numAccess) {
            alert('Por favor completa todos los campos');
            return;
        }

        // Capturar nombres de accesos
        const accesses = [];
        document.querySelectorAll('.access-name-input').forEach((input, index) => {
            const name = input.value.trim() || `Acceso ${index + 1}`;
            accesses.push({
                id: `access_${index}`,
                name: name,
                count: this.counters[`access_${index}`] || 0
            });
        });

        this.eventData = {
            title,
            maxCapacity,
            accesses
        };

        // Inicializar contadores
        accesses.forEach(access => {
            if (!this.counters[access.id]) {
                this.counters[access.id] = 0;
            }
        });

        this.saveToLocalStorage();
        this.generateQRCodes();
    }

    generateQRCodes() {
        const container = document.getElementById('qrContainer');
        container.innerHTML = '';

        document.getElementById('eventTitleDisplay').textContent = this.eventData.title;

        // QR para cada acceso
        this.eventData.accesses.forEach(access => {
            const card = document.createElement('div');
            card.className = 'qr-card';
            
            const qrDiv = document.createElement('div');
            qrDiv.id = `qr_${access.id}`;
            qrDiv.className = 'qr-code-container';

            card.innerHTML = `
                <h3>${access.name}</h3>
                <div id="qr_${access.id}" class="qr-code-container"></div>
                <button class="btn btn-success" onclick="app.scanAccessQR('${access.id}')">📱 Usar este acceso</button>
            `;

            container.appendChild(card);

            // Generar QR
            const qrData = {
                type: 'access',
                accessId: access.id,
                accessName: access.name,
                eventTitle: this.eventData.title
            };

            new QRCode(document.getElementById(`qr_${access.id}`), {
                text: JSON.stringify(qrData),
                width: 200,
                height: 200,
                colorDark: '#2563eb',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        });

        // QR para visualización general
        const dashboardCard = document.createElement('div');
        dashboardCard.className = 'qr-card';
        
        const dashboardQRDiv = document.createElement('div');
        dashboardQRDiv.id = 'qr_dashboard';
        dashboardQRDiv.className = 'qr-code-container';

        dashboardCard.innerHTML = `
            <h3>📊 Dashboard General</h3>
            <div id="qr_dashboard" class="qr-code-container"></div>
            <button class="btn btn-success" onclick="app.scanDashboardQR()">📱 Ver Dashboard</button>
        `;

        container.appendChild(dashboardCard);

        const dashboardQRData = {
            type: 'dashboard',
            eventTitle: this.eventData.title
        };

        new QRCode(document.getElementById('qr_dashboard'), {
            text: JSON.stringify(dashboardQRData),
            width: 200,
            height: 200,
            colorDark: '#10b981',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        this.showPanel('qrPanel');
    }

    scanAccessQR(accessId) {
        this.currentAccessId = accessId;
        this.showPanel('controlPanel');
        this.updateControlPanel();
    }

    scanDashboardQR() {
        this.showPanel('dashboardPanel');
        this.updateDashboard();
    }

    updateControlPanel() {
        if (!this.currentAccessId) return;

        const access = this.eventData.accesses.find(a => a.id === this.currentAccessId);
        if (!access) return;

        document.getElementById('accessName').textContent = access.name;
        document.getElementById('eventNameControl').textContent = this.eventData.title;
        document.getElementById('counter').textContent = this.counters[this.currentAccessId] || 0;
    }

    increment() {
        if (!this.currentAccessId) return;
        
        const total = this.getTotalPeople();
        if (total < this.eventData.maxCapacity) {
            this.counters[this.currentAccessId] = (this.counters[this.currentAccessId] || 0) + 1;
            this.updateControlPanel();
            this.saveToLocalStorage();
        } else {
            alert('⚠️ Aforo máximo alcanzado');
        }
    }

    decrement() {
        if (!this.currentAccessId) return;
        
        const currentCount = this.counters[this.currentAccessId] || 0;
        if (currentCount > 0) {
            this.counters[this.currentAccessId] -= 1;
            this.updateControlPanel();
            this.saveToLocalStorage();
        }
    }

    resetCounter() {
        if (!this.currentAccessId) return;
        
        if (confirm('¿Estás seguro de que quieres reiniciar el contador de este acceso?')) {
            this.counters[this.currentAccessId] = 0;
            this.updateControlPanel();
            this.saveToLocalStorage();
        }
    }

    getTotalPeople() {
        return Object.values(this.counters).reduce((sum, count) => sum + count, 0);
    }

    updateDashboard() {
        const total = this.getTotalPeople();
        const available = Math.max(0, this.eventData.maxCapacity - total);
        const occupancy = Math.round((total / this.eventData.maxCapacity) * 100);

        document.getElementById('dashboardTitle').textContent = this.eventData.title;
        document.getElementById('totalPeople').textContent = total;
        document.getElementById('maxCapacityDisplay').textContent = this.eventData.maxCapacity;
        document.getElementById('availableCapacity').textContent = available;
        document.getElementById('occupancyPercent').textContent = occupancy + '%';

        // Actualizar barra de progreso
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = occupancy + '%';
        progressBar.textContent = occupancy + '%';

        // Actualizar estado de accesos
        const accessesContainer = document.getElementById('accessesStatusContainer');
        let html = '<h3>Estado de Accesos</h3>';

        this.eventData.accesses.forEach(access => {
            const count = this.counters[access.id] || 0;
            html += `
                <div class="access-status-item">
                    <span class="access-status-name">${access.name}</span>
                    <span class="access-status-count">${count}</span>
                </div>
            `;
        });

        accessesContainer.innerHTML = html;
    }

    showPanel(panelId) {
        // Ocultar todos los paneles
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Mostrar el panel seleccionado
        document.getElementById(panelId).classList.add('active');

        // Actualizar datos si es el dashboard
        if (panelId === 'dashboardPanel') {
            this.updateDashboard();
        }
    }

    backToConfig() {
        this.showPanel('configPanel');
        this.renderAccessInputs();
    }

    downloadAllQR() {
        // Crear un documento HTML con todos los QR para imprimir
        const printWindow = window.open('', '', 'width=800,height=600');
        
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Códigos QR - ${this.eventData.title}</title>
                <style>
                    body { font-family: Arial; margin: 20px; }
                    h1 { text-align: center; }
                    .qr-sheet { page-break-after: always; }
                    .qr-item { margin: 20px 0; text-align: center; }
                    .qr-item h2 { margin: 10px 0; }
                    .qr-item img { max-width: 300px; }
                </style>
            </head>
            <body>
                <h1>Códigos QR - ${this.eventData.title}</h1>
                <h2>Aforo Máximo: ${this.eventData.maxCapacity}</h2>
        `;

        // Agregar QR de cada acceso
        this.eventData.accesses.forEach(access => {
            const canvas = document.querySelector(`#qr_${access.id} canvas`);
            if (canvas) {
                const imgData = canvas.toDataURL('image/png');
                html += `
                    <div class="qr-item qr-sheet">
                        <h2>${access.name}</h2>
                        <img src="${imgData}" alt="QR ${access.name}">
                        <p>Evento: ${this.eventData.title}</p>
                    </div>
                `;
            }
        });

        // Agregar QR del dashboard
        const dashboardCanvas = document.querySelector('#qr_dashboard canvas');
        if (dashboardCanvas) {
            const imgData = dashboardCanvas.toDataURL('image/png');
            html += `
                <div class="qr-item qr-sheet">
                    <h2>📊 Dashboard General</h2>
                    <img src="${imgData}" alt="QR Dashboard">
                    <p>Evento: ${this.eventData.title}</p>
                </div>
            `;
        }

        html += '</body></html>';
        printWindow.document.write(html);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }

    saveToLocalStorage() {
        const data = {
            eventData: this.eventData,
            counters: this.counters
        };
        localStorage.setItem('eventCapacityData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('eventCapacityData');
        if (saved) {
            const data = JSON.parse(saved);
            this.eventData = data.eventData;
            this.counters = data.counters;

            // Cargar datos en el formulario si existen
            if (this.eventData.title) {
                document.getElementById('eventTitle').value = this.eventData.title;
                document.getElementById('maxCapacity').value = this.eventData.maxCapacity;
                document.getElementById('numAccess').value = this.eventData.accesses.length;
                this.renderAccessInputs();
            }
        }
    }
}

// Inicializar la app cuando el DOM esté listo
const app = new EventCapacityApp();
