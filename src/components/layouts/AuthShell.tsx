/** Centered auth card over a soft accent glow and dotted grid. */
const AuthShell = ({ children }: { children: React.ReactNode }) => (
  <div className="relative isolate flex w-full flex-1 items-center justify-center py-6">
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 overflow-hidden sm:-inset-x-6 sm:-inset-y-8 lg:-inset-x-8"
    >
      <div className="absolute top-1/2 left-1/2 size-144 -translate-x-1/2 -translate-y-[60%] rounded-full bg-accent-400/20 blur-3xl dark:bg-accent-500/15" />
      <div
        className="absolute inset-0 text-stone-300 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] dark:text-stone-700"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
    </div>
    <div className="w-full max-w-100 animate-fade-up">{children}</div>
  </div>
);

export default AuthShell;
