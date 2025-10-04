class DeviceStatusManager {
    constructor() {
        this.deviceData = {
            isOnline: true,
            voltage: 3.3,
            temperature: 25,
            wifiSignal: -45,
            memoryUsage: 65,
            lastSeen: new Date(),
            uptime: 0
        };
        
        this.sensorData = {
            red: 0,
            green: 0,
            blue: 0,
            clear: 0
        };
        
        this.logs = [];
        this.init();
    }

    init() {
        this.updateDeviceStatus();
        this.updateMetrics();
        this.updateSensorReadings();
        this.updateSystemLogs();
        
        // Start real-time updates
        setInterval(() => this.simulateRealTimeData(), 2000);
        setInterval(() => this.updateDisplays(), 1000);
    }

    simulateRealTimeData() {
        // Simulate realistic sensor and system data
        this.deviceData.voltage = (3.2 + Math.random() * 0.3).toFixed(2);
        this.deviceData.temperature = (23 + Math.random() * 6).toFixed(1);
        this.deviceData.wifiSignal = (-40 - Math.random() * 30).toFixed(0);
        this.deviceData.memoryUsage = (60 + Math.random() * 25).toFixed(0);
        this.deviceData.uptime++;
        
        // Simulate sensor readings
        this.sensorData.red = Math.floor(100 + Math.random() * 500);
        this.sensorData.green = Math.floor(100 + Math.random() * 500);
        this.sensorData.blue = Math.floor(100 + Math.random() * 500);
        this.sensorData.clear = Math.floor(50 + Math.random() * 200);
        
        // Add random log entries
        if (Math.random() < 0.1) { // 10% chance
            this.addLogEntry();
        }
    }

    updateDisplays() {
        this.updateDeviceStatus();
        this.updateMetrics();
        this.updateSensorReadings();
    }

    updateDeviceStatus() {
        const statusElement = document.getElementById('deviceStatus');
        const statusText = document.getElementById('statusText');
        const lastSeen = document.getElementById('lastSeen');
        const uptime = document.getElementById('deviceUptime');
        
        if (this.deviceData.isOnline) {
            statusElement.className = 'device-status online';
            statusText.textContent = 'Online';
            lastSeen.textContent = 'Just now';
        } else {
            statusElement.className = 'device-status offline';
            statusText.textContent = 'Offline';
            lastSeen.textContent = this.deviceData.lastSeen.toLocaleString();
        }
        
        const hours = Math.floor(this.deviceData.uptime / 3600);
        const minutes = Math.floor((this.deviceData.uptime % 3600) / 60);
        uptime.textContent = `${hours}h ${minutes}m`;
    }

    updateMetrics() {
        // Voltage
        document.getElementById('voltageMetric').textContent = this.deviceData.voltage + 'V';
        const voltageStatus = document.getElementById('voltageStatus');
        if (this.deviceData.voltage < 3.0) {
            voltageStatus.className = 'metric-status critical';
            voltageStatus.textContent = 'Low';
        } else if (this.deviceData.voltage < 3.2) {
            voltageStatus.className = 'metric-status warning';
            voltageStatus.textContent = 'Warning';
        } else {
            voltageStatus.className = 'metric-status normal';
            voltageStatus.textContent = 'Normal';
        }
        
        // Temperature
        document.getElementById('temperatureMetric').textContent = this.deviceData.temperature + '°C';
        const tempStatus = document.getElementById('tempStatus');
        if (this.deviceData.temperature > 35) {
            tempStatus.className = 'metric-status critical';
            tempStatus.textContent = 'Hot';
        } else if (this.deviceData.temperature > 30) {
            tempStatus.className = 'metric-status warning';
            tempStatus.textContent = 'Warm';
        } else {
            tempStatus.className = 'metric-status normal';
            tempStatus.textContent = 'Normal';
        }
        
        // WiFi Signal
        document.getElementById('wifiMetric').textContent = this.deviceData.wifiSignal + ' dBm';
        const wifiStatus = document.getElementById('wifiStatus');
        if (this.deviceData.wifiSignal > -50) {
            wifiStatus.className = 'metric-status normal';
            wifiStatus.textContent = 'Excellent';
        } else if (this.deviceData.wifiSignal > -60) {
            wifiStatus.className = 'metric-status normal';
            wifiStatus.textContent = 'Good';
        } else if (this.deviceData.wifiSignal > -70) {
            wifiStatus.className = 'metric-status warning';
            wifiStatus.textContent = 'Fair';
        } else {
            wifiStatus.className = 'metric-status critical';
            wifiStatus.textContent = 'Poor';
        }
        
        // Memory Usage
        document.getElementById('memoryMetric').textContent = this.deviceData.memoryUsage + '%';
        const memoryStatus = document.getElementById('memoryStatus');
        if (this.deviceData.memoryUsage > 85) {
            memoryStatus.className = 'metric-status critical';
            memoryStatus.textContent = 'High';
        } else if (this.deviceData.memoryUsage > 70) {
            memoryStatus.className = 'metric-status warning';
            memoryStatus.textContent = 'Medium';
        } else {
            memoryStatus.className = 'metric-status normal';
            memoryStatus.textContent = 'Normal';
        }
    }

    updateSensorReadings() {
        document.getElementById('redReading').textContent = this.sensorData.red;
        document.getElementById('greenReading').textContent = this.sensorData.green;
        document.getElementById('blueReading').textContent = this.sensorData.blue;
        document.getElementById('clearReading').textContent = this.sensorData.clear;
    }

    addLogEntry() {
        const logTypes = [
            { type: 'info', message: 'Color detection completed successfully' },
            { type: 'warning', message: 'WiFi signal strength decreased' },
            { type: 'success', message: 'Sensor calibration updated' },
            { type: 'info', message: 'Data transmitted to server' },
            { type: 'warning', message: 'Memory usage above 80%' }
        ];
        
        const randomLog = logTypes[Math.floor(Math.random() * logTypes.length)];
        const logEntry = {
            timestamp: new Date(),
            type: randomLog.type,
            message: randomLog.message
        };
        
        this.logs.unshift(logEntry);
        if (this.logs.length > 50) {
            this.logs = this.logs.slice(0, 50); // Keep only last 50 logs
        }
        
        this.updateSystemLogs();
    }

    updateSystemLogs() {
        const logList = document.getElementById('systemLogs');
        logList.innerHTML = this.logs.map(log => `
            <div class="log-entry log-${log.type}">
                <span class="log-time">${log.timestamp.toLocaleTimeString()}</span>
                <span class="log-message">${log.message}</span>
            </div>
        `).join('');
    }
}

// Control functions
function restartDevice() {
    if (confirm('Are you sure you want to restart the device?')) {
        alert('Restart command sent to device');
        // Here you would make an API call to restart the device
    }
}

function calibrateSensor() {
    if (confirm('Start sensor calibration process?')) {
        alert('Calibration started. Please follow the instructions on the device.');
        // Here you would make an API call to start calibration
    }
}

function runDiagnostics() {
    alert('Running system diagnostics...');
    // Here you would make an API call to run diagnostics
    setTimeout(() => {
        alert('Diagnostics completed. All systems normal.');
    }, 2000);
}

function clearLogs() {
    if (confirm('Clear all system logs?')) {
        document.getElementById('systemLogs').innerHTML = '<div class="log-entry log-info"><span class="log-time">' + new Date().toLocaleTimeString() + '</span><span class="log-message">System logs cleared</span></div>';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DeviceStatusManager();
});