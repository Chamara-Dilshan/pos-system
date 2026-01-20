// ============================================================================
// Empty State Component - CloudPOS
// ============================================================================
import { tokens } from '../../config/colors';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  actionIcon,
  secondaryAction,
  secondaryActionLabel,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {/* Icon */}
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Icon size={32} className="text-gray-400" />
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className={`text-lg font-semibold ${tokens.text.primary} mb-2`}>
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p className={`${tokens.text.muted} max-w-sm mb-6`}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action} icon={actionIcon}>
              {actionLabel}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction} variant="secondary">
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
