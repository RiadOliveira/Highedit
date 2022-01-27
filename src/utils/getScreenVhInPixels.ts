const GetScreenVhInPixels = (value: number): number => {
  const screenHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0,
  );

  return (value * screenHeight) / 100;
};

export default GetScreenVhInPixels;
