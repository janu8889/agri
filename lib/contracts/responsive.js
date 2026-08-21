export const PAPER_SCREEN_WIDTH = 816;

export function contractPaperFit(viewportWidth) {
  const width = Math.max(0, Number(viewportWidth) || 0);
  const sideSpace = width < 700 ? 16 : 32;
  const available = Math.max(280, width - sideSpace);
  return Math.min(1, available / PAPER_SCREEN_WIDTH);
}
