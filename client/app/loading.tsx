export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
          aria-label="Loading"
        />
        <p className="text-sm text-muted-foreground">Loading, please wait…</p>
      </div>
    </div>
  );
}
