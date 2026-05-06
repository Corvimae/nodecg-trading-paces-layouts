import classNames from 'classnames';
import React from 'react';

interface CTALowerThirdProps {
  data: { data: string };
  isHidden: boolean;
  className?: string;
}

export const CTALowerThird: React.FC<CTALowerThirdProps> = ({
  className,
  data,
  isHidden,
}) => {
  const ctaClasses = classNames(
    'cta-lower-third__container',
    className,
    {
      'cta-lower-third__container--hidden': isHidden,
      'cta-lower-third__container--visible': !isHidden,
    },
  );

  return (
    <div className={ctaClasses}>
      <div className="cta-lower-third__label">Notice</div>
      <div className="cta-lower-third__text">{data.data}</div>
    </div>
  );
};
