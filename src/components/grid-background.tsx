export function GridBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Top-to-bottom gradient: black at top → warm grey at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #0a0a0a 0%, #0a0a0b 50%, #181820 70%, #282836 85%, #343444 100%)',
        }}
      />
    </div>
  );
}
