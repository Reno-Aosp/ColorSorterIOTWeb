class ColorSorterDashboard {
    constructor() {
        this.apiUrl = '/api/events';
        this.statusUrl = '/api/device-status';
        this.colors = [];
        this.startTime = new Date();
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupCharts();
        this.startRealTimeUpdates();
        this.updateSystemStatus();
        setInterval(() => this.updateSystemStatus(), 5000); // Update every 5 seconds
    }

    async loadData() {
        try {
            const response = await fetch(this.apiUrl);
            this.colors = await response.json();
            this.updateStatistics();
            this.updateRecentDetections();
            this.updateConnectionStatus(true);
        } catch (error) {
            console.error('Error loading data:', error);
            this.updateConnectionStatus(false);
        }
    }

    updateConnectionStatus(isConnected) {
        const statusIndicator = document.getElementById('connectionStatus');
        const statusText = document.getElementById('connectionText');
        
        if (isConnected) {
            statusIndicator.className = 'status-indicator';
            statusText.textContent = 'Connected';
        } else {
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = 'Disconnected';
        }
        
        // Update last update time
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
    }

    async updateSystemStatus() {
        try {
            // Simulate device status data (replace with real API call)
            const deviceData = {
                voltage: (3.2 + Math.random() * 0.2).toFixed(1),
                temperature: (24 + Math.random() * 4).toFixed(1),
                wifiSignal: -40 - Math.random() * 20,
                memoryUsage: (60 + Math.random() * 20).toFixed(0)
            };

            document.getElementById('voltageDisplay').textContent = deviceData.voltage + 'V';
            
            // Update uptime
            const uptime = new Date() - this.startTime;
            const hours = Math.floor(uptime / (1000 * 60 * 60));
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('systemUptime').textContent = `${hours}h ${minutes}m`;
            
        } catch (error) {
            console.error('Error updating system status:', error);
        }
    }

    updateStatistics() {
        const totalDetections = this.colors.length;
        const uniqueColors = [...new Set(this.colors.map(c => c.colorName))].length;
        const accuracyRate = Math.round((this.colors.filter(c => c.confidence > 0.8).length / totalDetections) * 100) || 0;

        document.getElementById('totalDetections').textContent = totalDetections;
        document.getElementById('uniqueColors').textContent = uniqueColors;
        document.getElementById('accuracyRate').textContent = accuracyRate + '%';

        // Update current detection
        if (this.colors.length > 0) {
            const latest = this.colors[this.colors.length - 1];
            this.updateCurrentDetection(latest);
        }
    }

    updateCurrentDetection(detection) {
        const colorPreview = document.getElementById('currentColorPreview');
        const colorName = document.getElementById('currentColorName');
        const confidence = document.getElementById('currentConfidence');
        const device = document.getElementById('currentDevice');

        colorPreview.style.backgroundColor = `rgb(${detection.r}, ${detection.g}, ${detection.b})`;
        colorName.textContent = detection.colorName.toUpperCase();
        confidence.textContent = Math.round(detection.confidence * 100);
        device.textContent = detection.deviceId;
    }

    setupCharts() {
        this.setupColorChart();
        this.setupTimelineChart();
    }

    setupColorChart() {
        const ctx = document.getElementById('colorChart').getContext('2d');
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
        const ctx = document.getElementById('timelineChart').getContext('2d');
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
        // Create hourly detection data for the last 24 hours
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
        }, 3000); // Update every 3 seconds
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ColorSorterDashboard();
});