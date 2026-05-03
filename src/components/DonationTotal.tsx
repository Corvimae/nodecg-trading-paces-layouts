import React from 'react';
import { BUNDLE_NAME, formatCurrency } from '../utils/utils';

const DONATION_ANIMATE_TIME_MS = 500;

export const DonationTotal: React.FC = () => {
  const [donationTotal] = cartographer.useReplicant<number>('donationTotal', 0, {
    namespace:BUNDLE_NAME,
  });

  const currentValue = cartographer.useRef(0);
  const displayedValueRef = cartographer.useRef(0);
  const [displayedValue, setDisplayedValue] = cartographer.useState(0);

  const animationIntervalId = cartographer.useRef<number | null>(null);

  const animateTotal = cartographer.useCallback((value: number) => {
    if (animationIntervalId.current) clearInterval(animationIntervalId.current);

		const current = currentValue.current;

		const difference = value - current;
		const timeBeforeIncrement = Math.max(difference <= DONATION_ANIMATE_TIME_MS ? Math.floor(DONATION_ANIMATE_TIME_MS / difference) : 1, 10);
		const incrementAmount = timeBeforeIncrement === 10 ? Math.ceil(difference / DONATION_ANIMATE_TIME_MS) * 10 : 1;

		animationIntervalId.current = window.setInterval(() => {
			const nextValue = Math.min(value, displayedValueRef.current) + incrementAmount;

			if (nextValue >= value) {
        if (animationIntervalId.current) clearInterval(animationIntervalId.current);
        setDisplayedValue(value);
        displayedValueRef.current = value;
      } else {
        setDisplayedValue(nextValue);
        displayedValueRef.current = nextValue;
      }
		}, timeBeforeIncrement);
  }, []);

  cartographer.useEffect(() => {
    animateTotal(donationTotal);
  }, [donationTotal]);

  const formattedTotal = cartographer.useMemo(() => (
    formatCurrency(displayedValue)
  ), [displayedValue]);

  return (
    <div className="donation-total__value">
      {[...formattedTotal].map((char, index) => (
        <div key={index} className="donation-total__value-character">
          {char}
        </div>
      ))}
    </div>
  );
}