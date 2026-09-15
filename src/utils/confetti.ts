import confetti from 'canvas-confetti';

/**
 * Standard dopamine spark confetti for normal task completions
 */
export function fireStandardConfetti(originX = 0.5, originY = 0.6) {
  confetti({
    particleCount: 45,
    spread: 60,
    origin: { x: originX, y: originY },
    colors: ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
    ticks: 200,
    gravity: 1.2,
    scalar: 0.9,
    disableForReducedMotion: true,
  });
}

/**
 * Grand Boss Task / Streak Milestone celebration
 * Multi-burst cannon explosion with stars, shapes, and sparkling colors
 */
export function fireBossTaskConfetti() {
  const duration = 2.2 * 1000;
  const animationEnd = Date.now() + duration;

  const defaults = {
    startVelocity: 35,
    spread: 360,
    ticks: 280,
    zIndex: 9999,
    disableForReducedMotion: true,
  };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Left cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#f43f5e', '#fb923c', '#facc15', '#a855f7'],
    });

    // Right cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981'],
    });
  }, 250);
}
