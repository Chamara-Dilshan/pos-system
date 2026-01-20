// ============================================================================
// Loading Component - CloudPOS
// ============================================================================
import { tokens } from '../../config/colors';

const Loading = ({
  message = 'Loading...',
  size = 'md',
  fullScreen = true,
  overlay = false,
}) => {
  // ── Size Variants ─────────────────────────────────────────────────────────
  const sizes = {
    sm: { spinner: 'h-6 w-6', text: 'text-sm' },
    md: { spinner: 'h-10 w-10', text: 'text-base' },
    lg: { spinner: 'h-14 w-14', text: 'text-lg' },
    xl: { spinner: 'h-20 w-20', text: 'text-xl' },
  };

  // ── Spinner Component ─────────────────────────────────────────────────────
  const Spinner = () => (
    <div className="relative">
      {/* Outer Ring */}
      <div
        className={`
          ${sizes[size].spinner}
          rounded-full
          border-4 border-gray-200
        `}
      />
      {/* Spinning Arc */}
      <div
        className={`
          absolute top-0 left-0
          ${sizes[size].spinner}
          rounded-full
          border-4 border-transparent border-t-blue-600
          animate-spin
        `}
      />
    </div>
  );

  // ── Content ───────────────────────────────────────────────────────────────
  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <Spinner />
      {message && (
        <p className={`${sizes[size].text} ${tokens.text.secondary} font-medium`}>
          {message}
        </p>
      )}
    </div>
  );

  // ── Full Screen Loading ───────────────────────────────────────────────────
  if (fullScreen) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${tokens.bg.page}`}>
        <LoadingContent />
      </div>
    );
  }

  // ── Overlay Loading ───────────────────────────────────────────────────────
  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <LoadingContent />
      </div>
    );
  }

  // ── Inline Loading ────────────────────────────────────────────────────────
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingContent />
    </div>
  );
};

// ── Loading Skeleton ────────────────────────────────────────────────────────
export const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'h-10 w-10 rounded-full',
    thumbnail: 'h-20 w-20 rounded-lg',
    card: 'h-32 rounded-lg',
    button: 'h-10 w-24 rounded-lg',
  };

  return (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${variants[variant]}
        ${className}
      `}
    />
  );
};

// ── Loading Dots ────────────────────────────────────────────────────────────
export const LoadingDots = ({ size = 'md' }) => {
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${dotSizes[size]}
            bg-blue-600 rounded-full
            animate-bounce
          `}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};

export default Loading;
