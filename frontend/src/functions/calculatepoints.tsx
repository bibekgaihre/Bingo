export function calculateWinningPoints(phrases: string[]) {
  const rows = [];
  for (let i = 0; i < phrases.length; i += 5) {
    rows.push(phrases.slice(i, i + 5));
  }
  const columns = [];
  for (let i = 0; i < 5; i++) {
    const col: any = [];
    for (let j = 0; j < 5; j++) {
      col.push(phrases[i + j * 5]);
    }

    columns.push(col);
  }
  const diagonals = [
    [phrases[0], phrases[6], phrases[12], phrases[18], phrases[24]],
    [phrases[4], phrases[8], phrases[12], phrases[16], phrases[20]],
  ];
  return [...rows, ...columns, ...diagonals];
}
