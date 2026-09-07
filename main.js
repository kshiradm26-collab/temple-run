/**
 * ============================================================================
 * DRAGON TEMPLE: CHASM ESCAPE - 3D Endless Runner Game Engine
 * Main entry point alias for game.js
 * ============================================================================
 */

// Import / Forward to game.js logic if evaluated separately
if (typeof window !== 'undefined' && !window.gameEngine) {
  const script = document.createElement('script');
  script.src = 'game.js';
  document.head.appendChild(script);
}
