class ColorSorterDashboard {
    constructor() {
        this.apiUrl = 'http://localhost:1000/api/events';
        this.statusUrl = 'http://localhost:1000/api/device-status';
        this.colors = []; // Initialize as empty array
        this.startTime = new Date();
        this.colorChart = null;
        this.timelineChart = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupCharts();
        this.startRealTimeUpdates();
        this.updateSystemStatus();
        setInterval(() => this.updateSystemStatus(), 5000);
    }

    async loadData() {
        try {
            const response = await fetch(this.apiUrl);
            
            // Check if response is OK
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Ensure data is an array
            if (Array.isArray(data)) {
                this.colors = data;
            } else {
                console.warn('API returned non-array data:', data);
                this.colors = [];
            }
            
            this.updateStatistics();
            this.updateRecentDetections();
            this.updateConnectionStatus(true);
        } catch (error) {
            console.error('Error loading data:', error);
            this.colors = []; // Fallback to empty array
            this.updateConnectionStatus(false);
            
            // Show user-friendly message
            this.showErrorMessage('Unable to connect to backend. Please ensure the server is running on port 1000.');
        }
    }

    showErrorMessage(message) {
        const detectionList = document.getElementById('detectionList');
        if (detectionList) {
            detectionList.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #f44336;">
                    <h3>⚠️ Connection Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        🔄 Retry
                    </button>
                </div>
            `;
        }
    }

    updateConnectionStatus(isConnected) {
        const statusIndicator = document.getElementById('connectionStatus');
        const statusText = document.getElementById('connectionText');
        
        if (statusIndicator && statusText) {
            if (isConnected) {
                statusIndicator.className = 'status-indicator';
                statusText.textContent = 'Connected';
            } else {
                statusIndicator.className = 'status-indicator offline';
                statusText.textContent = 'Disconnected';
            }
        }
        
        // Update last update time
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            lastUpdate.textContent = new Date().toLocaleTimeString();
        }
    }

    async updateSystemStatus() {
        try {
            // Fetch REAL data from ESP32
            const response = await fetch(this.statusUrl); // Uses 'http://localhost:1000/api/device-status'
            
            if (response.ok) {
                const deviceData = await response.json();
                
                // Update voltage
                const voltageDisplay = document.getElementById('voltageDisplay');
                if (voltageDisplay && deviceData.voltage) {
                    voltageDisplay.textContent = deviceData.voltage + 'V';
                }
                
                // Update temperature
                const tempDisplay = document.getElementById('temperatureDisplay');
                if (tempDisplay && deviceData.temperature) {
                    tempDisplay.textContent = deviceData.temperature + '°C';
                }
                
                // Update WiFi signal
                const wifiDisplay = document.getElementById('wifiDisplay');
                if (wifiDisplay && deviceData.wifiSignal) {
                    wifiDisplay.textContent = deviceData.wifiSignal + ' dBm';
                }
                
                // Update memory
                const memoryDisplay = document.getElementById('memoryDisplay');
                if (memoryDisplay && deviceData.memoryUsage) {
                    memoryDisplay.textContent = deviceData.memoryUsage + ' KB';
                }
            }
            
            // Update uptime
            const uptime = new Date() - this.startTime;
            const hours = Math.floor(uptime / (1000 * 60 * 60));
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
            const uptimeElement = document.getElementById('systemUptime');
            if (uptimeElement) {
                uptimeElement.textContent = `${hours}h ${minutes}m`;
            }
            
        } catch (error) {
            console.error('Error updating system status:', error);
        }
    }

    updateStatistics() {
        // Safety check: ensure colors is an array
        if (!Array.isArray(this.colors)) {
            console.warn('this.colors is not an array:', this.colors);
            this.colors = [];
        }

        const totalDetections = this.colors.length;
        const uniqueColors = [...new Set(this.colors.map(c => c.colorName))].length;
        const accuracyRate = totalDetections > 0 
            ? Math.round((this.colors.filter(c => c.confidence > 0.8).length / totalDetections) * 100) 
            : 0;

        const totalElement = document.getElementById('totalDetections');
        const uniqueElement = document.getElementById('uniqueColors');
        const accuracyElement = document.getElementById('accuracyRate');

        if (totalElement) totalElement.textContent = totalDetections;
        if (uniqueElement) uniqueElement.textContent = uniqueColors;
        if (accuracyElement) accuracyElement.textContent = accuracyRate + '%';

        // Update current detection
        if (this.colors.length > 0) {
            const latest = this.colors[this.colors.length - 1];
            this.updateCurrentDetection(latest);
        } else {
            this.clearCurrentDetection();
        }
    }

    clearCurrentDetection() {
        const colorPreview = document.getElementById('currentColorPreview');
        const colorName = document.getElementById('currentColorName');
        const confidence = document.getElementById('currentConfidence');
        const device = document.getElementById('currentDevice');

        if (colorPreview) colorPreview.style.backgroundColor = '#ddd';
        if (colorName) colorName.textContent = 'Waiting for detection...';
        if (confidence) confidence.textContent = '--';
        if (device) device.textContent = '--';
    }

    updateCurrentDetection(detection) {
        const colorPreview = document.getElementById('currentColorPreview');
        const colorName = document.getElementById('currentColorName');
        const confidence = document.getElementById('currentConfidence');
        const device = document.getElementById('currentDevice');

        if (colorPreview) colorPreview.style.backgroundColor = `rgb(${detection.r}, ${detection.g}, ${detection.b})`;
        if (colorName) colorName.textContent = detection.colorName.toUpperCase();
        if (confidence) confidence.textContent = Math.round(detection.confidence * 100);
        if (device) device.textContent = detection.deviceId;
    }

    setupCharts() {
        this.setupColorChart();
        this.setupTimelineChart();
    }

    setupColorChart() {
        const canvas = document.getElementById('colorChart');
        if (!canvas) return;

        // Destroy existing chart before creating new one
        if (this.colorChart) {
            this.colorChart.destroy();
        }

        const ctx = canvas.getContext('2d');
        const colorCounts = this.getColorCounts();
        
        this.colorChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(colorCounts),
                datasets: [{
                    data: Object.values(colorCounts),
                    backgroundColor: this.getColorPalette(Object.keys(colorCounts))
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    setupTimelineChart() {
        const canvas = document.getElementById('timelineChart');
        if (!canvas) return;

        // Destroy existing chart before creating new one
        if (this.timelineChart) {
            this.timelineChart.destroy();
        }

        const ctx = canvas.getContext('2d');
        const timelineData = this.getTimelineData();
        
        this.timelineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timelineData.labels,
                datasets: [{
                    label: 'Detections per Hour',
                    data: timelineData.data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    getColorCounts() {
        const counts = {};
        // Safety check
        if (!Array.isArray(this.colors)) {
            return counts;
        }
        
        this.colors.forEach(color => {
            counts[color.colorName] = (counts[color.colorName] || 0) + 1;
        });
        return counts;
    }

    // Normalize color; default to white
    normalizeColorName(name) {
        const c = (name || '').trim().toLowerCase();
        return c ? c : 'white';
    }

    // Only allow red, green, yellow, and white (default)
    getColorPalette(names) {
        const palette = {
            red:    '#FF6B6B',
            green:  '#4ECDC4',
            yellow: '#FFD700',
            white:  '#FFFFFF'
        };
        return names.map(n => palette[n] || '#95A5A6');
    }

    startRealTimeUpdates() {
        setInterval(async () => {
            await this.loadData();
        }, 3000);
    }

    // Update this method to default to white
    setCurrentColor(colorName) {
        const safe = (colorName || '').trim().toLowerCase() || 'white'; // Force default to white
        this.currentColor = safe;

        const colorPreview = document.getElementById('currentColorPreview');
        const colorNameElement = document.getElementById('currentColorName');
        const confidence = document.getElementById('currentConfidence');
        const device = document.getElementById('currentDevice');

        if (colorPreview) colorPreview.style.backgroundColor = `rgb(${this.currentColor.r}, ${this.currentColor.g}, ${this.currentColor.b})`;
        if (colorNameElement) colorNameElement.textContent = this.currentColor.colorName.toUpperCase();
        if (confidence) confidence.textContent = Math.round(this.currentColor.confidence * 100);
        if (device) device.textContent = this.currentColor.deviceId;
    }

    // Or wherever you handle color detection, add this check
    handleDetectionResult(result) {
        let color = result?.color || 'white'; // Default to white if no color
        if (!color || color.trim().toLowerCase() === 'none') {
            color = 'white';
        }
        this.setCurrentColor(color);
        // ...existing code...
    }

    async postDetection(event) {
        const color = this.normalizeColorName(event?.color || this.currentColor);
        if (color === 'white' || color === 'none' || color === 'no_detection') {
            return; // do not send to backend
        }

        try {
            await fetch('/api/events', {
                method: 'POST',
                body: JSON.stringify(event),
                headers: {'Content-Type':'application/json'}
            });
        } catch (error) {
            console.error('Error posting detection:', error);
        }
    }

    // If you build charts from counts, ensure yellow shows up
    buildChartData(countsByColor) {
        const colors = ['red','green','yellow']; // only red, green, yellow
        const data = colors.map(c => countsByColor[c] || 0);
        const bg  = this.getColorPalette(colors);
        return { labels: colors, datasets:[{ data, backgroundColor: bg }] };
    }

    getTimelineData() {
        const hours = [];
        const data = [];
        const now = new Date();
        
        for (let i = 23; i >= 0; i--) {
            const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
            hours.push(hour.getHours() + ':00');
            
            const count = this.colors.filter(color => {
                const colorTime = new Date(color.timestamp);
                return colorTime.getHours() === hour.getHours() && 
                       colorTime.toDateString() === hour.toDateString();
            }).length;
            
            data.push(count);
        }
        
        return { labels: hours, data: data };
    }

    updateRecentDetections() {
        const detectionList = document.getElementById('detectionList');
        if (!detectionList) return;

        if (!Array.isArray(this.colors) || this.colors.length === 0) {
            detectionList.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #999;">
                    <p>No color detections yet. Send some test colors!</p>
                </div>
            `;
            return;
        }

        const recent = this.colors.slice(-10).reverse();
        
        detectionList.innerHTML = recent.map(detection => `
            <div class="detection-item">
                <div class="detection-color" style="background-color: rgb(${detection.r}, ${detection.g}, ${detection.b})"></div>
                <div class="detection-details">
                    <strong>${detection.colorName}</strong>
                    <span class="detection-time">${new Date(detection.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="detection-confidence">${Math.round(detection.confidence * 100)}%</div>
            </div>
        `).join('');
    }
}

// Global function to clear history
async function clearHistory() {
    if (!confirm('⚠️ Are you sure you want to delete ALL detection history?\n\nThis action cannot be undone!')) {
        return;
    }

    // Show loading state
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Deleting...';
    btn.disabled = true;

    try {
        const response = await fetch('http://localhost:1000/api/events', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.text();
            console.log('Delete result:', result);
            alert('✅ ' + result);
            location.reload(); // Reload page to refresh data
        } else {
            const errorText = await response.text();
            console.error('Delete failed:', errorText);
            alert('❌ Failed to clear history. Status: ' + response.status + '\n' + errorText);
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    } catch (error) {
        console.error('Error clearing history:', error);
        alert('❌ Error: ' + error.message + '\n\nMake sure the backend server is running on port 1000.');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ColorSorterDashboard();
});

// Assuming you have a function to update the chart
function updateChart(data) {
    myChart.data.datasets[0].data = [
        data.sensorReadings.red,
        data.sensorReadings.green,
        data.sensorReadings.blue,
        data.sensorReadings.yellow // new color
    ];
    myChart.update();
}