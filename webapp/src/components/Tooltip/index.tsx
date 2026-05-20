import { useState } from 'react';
import css from './index.module.scss';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={css.wrap}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`${css.tooltip} ${css[position]}`} role="tooltip">
          {content}
          <div className={css.arrow} />
        </div>
      )}
    </div>
  );
};
