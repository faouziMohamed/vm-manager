/* eslint-disable react/jsx-props-no-spreading */
import { Text, TextProps } from '@chakra-ui/react';

export default function Paragraph(props: TextProps) {
  const { children, ...rest } = props;
  return (
    <Text
      as='p'
      fontSize='sm'
      fontFamily='var(--font-primary)'
      lineHeight='tall'
      {...rest}
    >
      {children}
    </Text>
  );
}
