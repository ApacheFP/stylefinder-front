import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';

// Theme transition duration - must match CSS variable
const THEME_TRANSITION_DURATION = 400;

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    targetColor: string;
    transitionProgress: number;
}

// Color interpolation helper
const interpolateColor = (startColor: string, endColor: string, progress: number): string => {
    // Parse rgba values
    const parseRgba = (color: string) => {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3]),
                a: parseFloat(match[4] || '1')
            };
        }
        return { r: 0, g: 0, b: 0, a: 1 };
    };

    const start = parseRgba(startColor);
    const end = parseRgba(endColor);

    const r = Math.round(start.r + (end.r - start.r) * progress);
    const g = Math.round(start.g + (end.g - start.g) * progress);
    const b = Math.round(start.b + (end.b - start.b) * progress);
    const a = start.a + (end.a - start.a) * progress;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>(0);
    const prevThemeRef = useRef(theme);

    // Get color for theme
    const getColorForTheme = useCallback((isDark: boolean) => {
        const alpha = isDark
            ? Math.random() * 0.3 + 0.1
            : Math.random() * 0.2 + 0.05;
        return isDark
            ? `rgba(196, 164, 132, ${alpha})` // Light bronze for dark mode
            : `rgba(166, 124, 82, ${alpha})`; // Bronze for light mode
    }, []);

    // Create a particle
    const createParticle = useCallback((canvas: HTMLCanvasElement, isDark: boolean): Particle => {
        const color = getColorForTheme(isDark);
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            color,
            targetColor: color,
            transitionProgress: 1
        };
    }, [getColorForTheme]);

    // Initialize particles
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Reinitialize particles on resize
            const isDark = theme === 'dark';
            const particleCount = Math.floor(window.innerWidth * 0.4);
            particlesRef.current = Array.from({ length: particleCount }, () =>
                createParticle(canvas, isDark)
            );
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach(particle => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Wrap around screen
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.y > canvas.height) particle.y = 0;
                if (particle.y < 0) particle.y = canvas.height;

                // Handle color transition
                if (particle.transitionProgress < 1) {
                    particle.transitionProgress += 16 / THEME_TRANSITION_DURATION; // ~60fps
                    if (particle.transitionProgress > 1) particle.transitionProgress = 1;
                    particle.color = interpolateColor(
                        particle.color,
                        particle.targetColor,
                        particle.transitionProgress
                    );
                }

                // Draw particle
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Initial setup
        resizeCanvas();
        animate();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [createParticle, theme]);

    // Handle theme changes - trigger smooth color transition
    useEffect(() => {
        if (prevThemeRef.current === theme) return;
        prevThemeRef.current = theme;

        const isDark = theme === 'dark';

        // Start color transition for all particles
        particlesRef.current.forEach(particle => {
            particle.targetColor = getColorForTheme(isDark);
            particle.transitionProgress = 0;
        });
    }, [theme, getColorForTheme]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
};

export default ParticleBackground;
