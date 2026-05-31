const STATUS_CONFIG = {
  passed: {
    label: 'תקין',
    icon: '✓',
    classes: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  },
  discrepancy: {
    label: 'הפרש',
    icon: '⚠',
    classes: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  },
  error: {
    label: 'שגיאה',
    icon: '✕',
    classes: 'bg-red-500/20 text-red-400 border border-red-500/30',
  },
  failed: {
    label: 'נכשל',
    icon: '✕',
    classes: 'bg-red-500/20 text-red-400 border border-red-500/30',
  },
};

const StatusChip = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.error;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      ${config.classes} ${sizeClasses[size]}
    `}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default StatusChip;