type Props = {
  size?: number;
};

export default function Loading({ size = 100 }: Props) {
  return (
    <div className="fixed inset-0 bg-white/80 z-50 h-full w-full flex items-center justify-center">
      <img
        src="/assets/logo/logo.png"
        alt="logo"
        width={size}
        height={size}
        className="animate-pulse duration-800"
      />
    </div>
  );
}
