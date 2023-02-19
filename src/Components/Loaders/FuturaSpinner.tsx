import { useEffect, useRef } from 'react';

type FuturaSpinnerProps = {
  semiTransparent?: boolean;
  transparent?: boolean;
};
export default function FuturaSpinner(props: FuturaSpinnerProps) {
  const { semiTransparent = false, transparent = false } = props;
  const ref = useRef<HTMLDivElement>(null);
  let className = `spinner-preloader`;
  if (semiTransparent) {
    className += ` spinner-semi-transparent`;
  } else if (transparent) {
    className += ` spinner-transparent`;
  }
  useEffect(() => ref.current?.focus(), []);
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore: Make div focusable */}
      <div className={className} ref={ref} tabIndex='0'>
        <div className='load-spinner' />
      </div>
    </>
  );
}
