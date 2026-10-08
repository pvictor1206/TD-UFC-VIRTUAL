function ProgressBar({ porcentagem = 0, colorProgress = "#35b354" }) {
  const pct = Math.round(porcentagem);

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="w-full bg-gray-200 h-1.5">
        <div
          className="h-1.5 transition-all duration-300"
          style={{
            width: `${pct}%`,
            backgroundColor: colorProgress,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
