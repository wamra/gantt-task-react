export const generateTrianglePoints = (
  x: number,
  y: number,
  width: number,
  isLeftDirected: boolean,
) => {
  if (isLeftDirected) {
    return `${x},${y} 
    ${x + width},${y + width} 
    ${x + width},${y - width}`;
  }

  return `${x},${y} 
    ${x - width},${y - width} 
    ${x - width},${y + width}`;
};
