// Simple Fluency Map Radar Chart
class FluencyChart {
    constructor(containerId, data, language = 'en') {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.language = language;
        this.skills = ['listening', 'reading', 'speaking', 'writing'];
        this.skillNames = {
            en: ['Listening', 'Reading', 'Speaking', 'Writing'],
            ar: ['الاستماع', 'القراءة', 'التحدث', 'الكتابة']
        };
        this.init();
    }

    init() {
        this.createChart();
    }

    createChart() {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 120;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background circles
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // Draw axes
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        for (let i = 0; i < this.skills.length; i++) {
            const angle = (i * 2 * Math.PI) / this.skills.length - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        
        // Draw skill labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Inter, Noto Sans Arabic, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < this.skills.length; i++) {
            const angle = (i * 2 * Math.PI) / this.skills.length - Math.PI / 2;
            const labelRadius = radius + 20;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;
            
            ctx.fillText(this.skillNames[this.language][i], x, y);
        }
        
        // Draw data polygon
        if (this.data) {
            ctx.strokeStyle = '#667eea';
            ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            for (let i = 0; i < this.skills.length; i++) {
                const skill = this.skills[i];
                const value = this.getSkillValue(skill);
                const angle = (i * 2 * Math.PI) / this.skills.length - Math.PI / 2;
                const x = centerX + Math.cos(angle) * (value * radius);
                const y = centerY + Math.sin(angle) * (value * radius);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Draw data points
            ctx.fillStyle = '#667eea';
            for (let i = 0; i < this.skills.length; i++) {
                const skill = this.skills[i];
                const value = this.getSkillValue(skill);
                const angle = (i * 2 * Math.PI) / this.skills.length - Math.PI / 2;
                const x = centerX + Math.cos(angle) * (value * radius);
                const y = centerY + Math.sin(angle) * (value * radius);
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
        
        // Add to container
        this.container.innerHTML = '';
        this.container.appendChild(canvas);
    }

    getSkillValue(skill) {
        if (!this.data || !this.data.skills || !this.data.skills[skill]) {
            return 0;
        }
        
        const level = this.data.skills[skill].level;
        const levelValues = {
            'A1': 0.2,
            'A2': 0.4,
            'B1': 0.6,
            'B2': 0.8,
            'C1': 0.9,
            'C2': 1.0,
            'Not tested': 0
        };
        
        return levelValues[level] || 0;
    }

    updateData(newData) {
        this.data = newData;
        this.createChart();
    }

    updateLanguage(newLanguage) {
        this.language = newLanguage;
        this.createChart();
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FluencyChart;
}
