class ColorSorterDashboard {
    constructor() {
        this.apiUrl = 'http://localhost:1000/api/events';
        this.statusUrl = 'http://localhost:1000/api/device-status';
        this.colors = []; // Initialize as empty array
        this.startTime = new Date();
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
            const deviceData = {
                voltage: (3.2 + Math.random() * 0.2).toFixed(1),
                temperature: (24 + Math.random() * 4).toFixed(1),
                wifiSignal: -40 - Math.random() * 20,
                memoryUsage: (60 + Math.random() * 20).toFixed(0)
            };

            const voltageDisplay = document.getElementById('voltageDisplay');
            if (voltageDisplay) {
                voltageDisplay.textContent = deviceData.voltage + 'V';
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

        const ctx = canvas.getContext('2d');
        const colorCounts = this.getColorCounts();
        
        new Chart(ctx, {
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

        const ctx = canvas.getContext('2d');
        const timelineData = this.getTimelineData();
        
        new Chart(ctx, {
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

    getColorPalette(colorNames) {
        const palette = {
            'red': '#FF6B6B',
            'green': '#4ECDC4',
            'blue': '#45B7D1',
            'yellow': '#FFA07A',
            'orange': '#FF8C42',
            'purple': '#9B59B6',
            'pink': '#FF69B4',
            'cyan': '#00CED1',
            'white': '#F8F9FA',
            'black': '#343A40',
            'gray': '#6C757D'
        };
        
        return colorNames.map(name => palette[name] || '#95A5A6');
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

    startRealTimeUpdates() {
        setInterval(async () => {
            await this.loadData();
        }, 3000);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ColorSorterDashboard();
});