import React from 'react';
import { NameplateData, NameplateLowerThird } from './NameplateLowerThird';
import { CTALowerThird } from './CTALowerThird';
import { SUPPLEMENTARIES_MODULE_NAME } from '../utils/utils';

interface LowerThirdData {
  type: string;
  data: Record<string, unknown>;
}
export const LowerThirds: React.FC = () => {
  const [lastShownLowerThird, setLastShownLowerThird] = cartographer.useState<LowerThirdData | null>(null);
  const [activeLowerThird] = cartographer.useReplicant<LowerThirdData | null>('lowerThirds:active', null, {
    namespace: SUPPLEMENTARIES_MODULE_NAME,
  });

  cartographer.useEffect(() => {
    if (activeLowerThird !== null) setLastShownLowerThird(activeLowerThird);
  }, [activeLowerThird]);

  const isHidden = activeLowerThird === null;
  
  if (!lastShownLowerThird) return null;

  if (lastShownLowerThird.type === 'nameplates') {
    const data = (lastShownLowerThird as unknown) as { data: NameplateData[] };

    return <NameplateLowerThird data={data} isHidden={isHidden} />;
  }

  if (lastShownLowerThird.type === 'cta') {
    const data = (lastShownLowerThird as unknown) as { data: string };
  
    return <CTALowerThird data={data} isHidden={isHidden} />;
  }

  console.error('Invalid lower third type: ', lastShownLowerThird.type);

  return null;
}