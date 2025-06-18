import React from 'react';
import classNames from 'classnames';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  footer,
  className,
  variant = 'default',
  padding = 'md',
  header,
}) => {
  const variantClasses = {
    default: 'bg-white shadow-sm',
    glass: 'bg-white/70 backdrop-blur-glass shadow-glass',
    bordered: 'border border-gray-200 bg-white',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  return (
    <div
      className={classNames(
        'rounded-lg',
        variantClasses[variant],
        className
      )}
    >
      {(header || title || description) && (
        <div className={classNames('border-b border-gray-100', paddingClasses[padding])}>
          {header ? (
            header
          ) : (
            <>
              {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
              {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </>
          )}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
      {footer && (
        <div className={classNames('border-t border-gray-100', paddingClasses[padding])}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;