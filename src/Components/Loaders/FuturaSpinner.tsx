/* eslint-disable react/jsx-props-no-spreading */
import { Box, BoxProps } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

type FuturaSpinnerProps = {
  semiTransparent?: boolean;
  transparent?: boolean;
} & BoxProps;
export default function FuturaSpinner(props: FuturaSpinnerProps) {
  const { semiTransparent = false, transparent = false, ...others } = props;
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
      <Box className={className} ref={ref} tabIndex='0' {...others}>
        <div className='load-spinner' />
      </Box>
    </>
  );
}
