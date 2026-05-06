import classNames from 'classnames';
import React from 'react';

export interface NameplateData {
  name: string;
  pronouns?: string;
  title?: string;
}

interface NameplateLowerThirdSectionProps {
  nameplate: NameplateData;
}

export const NameplateLowerThirdSection: React.FC<NameplateLowerThirdSectionProps> = ({
  nameplate,
}) => (
  <div className="nameplates__nameplate">
    <div className="nameplates__nameplate-name">
      <div>
        {nameplate.name}
      </div>
      {nameplate.pronouns && (
        <div className="nameplates__nameplate-pronouns">{nameplate.pronouns}</div>
      )}
    </div>
    <div className="nameplates__nameplate-subtitle">
      {nameplate.title || 'See above'}
    </div>
  </div>
);

interface NameplateLowerThirdProps {
  data: { data: NameplateData[] };
  isHidden: boolean;
  className?: string;
}

export const NameplateLowerThird: React.FC<NameplateLowerThirdProps> = ({ className, data, isHidden }) => {
  const visibleNameplates = data.data.filter(item => item.name.length > 0);

  const nameplateClasses = classNames(
    'nameplates__container',
    `nameplates__container--segments-${visibleNameplates.length}`,
    className,
    {
      'nameplates__container--hidden': isHidden,
      'nameplates__container--visible': !isHidden,
    },
  );

  return (
    <div className={nameplateClasses}>
      {visibleNameplates.map((nameplate, index) => (
        <NameplateLowerThirdSection key={index} nameplate={nameplate} />
      ))}
    </div>
  );
};
