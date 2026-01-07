interface ButtonProps {
  link: string;
  label: string;
  style: 'primary' | 'secondary' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
  type: 'ghost' | 'link' | 'outline' | 'disabled' | '';
  size: 'default' | 'large' | 'small' | 'tiny' | 'wide' | '';
  icon?: string;
  external?: boolean;
}

const Button = ({ link, label, style, type, size, icon, external = false }: ButtonProps) => {
  const sizeClasses: Record<string, string> = {
    '': '',
    default: '',
    large: 'btn-lg',
    small: 'btn-sm',
    tiny: 'btn-xs',
    wide: 'btn-wide',
  };

  const typeClasses: Record<string, string> = {
    '': '',
    ghost: 'btn-ghost',
    link: 'btn-link',
    outline: 'btn-outline',
    disabled: 'btn-disabled',
  };

  return (
    <a
      href={link}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`
        btn
        ${style === 'primary' ? 'btn-primary' : ''}
        ${style === 'secondary' ? 'btn-secondary' : ''}
        ${style === 'neutral' ? 'btn-neutral' : ''}
        ${style === 'info' ? 'btn-info' : ''}
        ${style === 'success' ? 'btn-success' : ''}
        ${style === 'warning' ? 'btn-warning' : ''}
        ${style === 'error' ? 'btn-error' : ''}
        ${typeClasses[type] || ''}
        ${sizeClasses[size] || ''}
        transition-all duration-150
        hover:shadow-lg hover:-translate-y-0.5
        active:scale-95 active:shadow-sm
        inline-flex items-center gap-2
        no-underline
      `.trim().replace(/\s+/g, ' ')}
    >
      {icon && (
        <span className="inline-flex items-center" dangerouslySetInnerHTML={{ __html: icon }} />
      )}
      {label}
    </a>
  );
};

export default Button;
