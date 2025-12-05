import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;

            constructor() {
                this.x = Math.random() * (canvas?.width || window.innerWidth);
                this.y = Math.random() * (canvas?.height || window.innerHeight);
                this.size = Math.random() * 2 + 0.5; // Random size between 0.5 and 2.5
                this.speedX = Math.random() * 0.5 - 0.25; // Random speed
                this.speedY = Math.random() * 0.5 - 0.25;

                // Theme-aware colors - Warm bronze/tan
                const isDark = document.documentElement.classList.contains('dark');
                // Using warm bronze colors
                this.color = isDark
                    ? `rgba(196, 164, 132, ${Math.random() * 0.3 + 0.1})` // Light bronze for dark mode
                    : `rgba(166, 124, 82, ${Math.random() * 0.2 + 0.05})`; // Bronze for light mode
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around screen
                if (canvas) {
                    if (this.x > canvas.width) this.x = 0;
                    if (this.x < 0) this.x = canvas.width;
                    if (this.y > canvas.height) this.y = 0;
                    if (this.y < 0) this.y = canvas.height;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor(window.innerWidth * 0.4); // Even higher density
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        // Initial setup
        resizeCanvas();
        animate();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]); // Re-init on theme change to update colors

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default ParticleBackground;
