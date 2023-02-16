import {
  Box,
  FormErrorMessage,
  Heading,
  HeadingProps,
  Text,
} from '@chakra-ui/react';

export type CustomErrorMessageProps = {
  heading: string;
  rules?: string[];
  as?: HeadingProps['as'];
};
export default function CustomFormControlErrorMessage({
  heading,
  rules,
  as = 'h3',
}: CustomErrorMessageProps) {
  return (
    <FormErrorMessage flexDirection='column' alignItems='flex-start'>
      <Heading as={as} fontSize='xs'>
        {heading}
      </Heading>
      {!!rules && (
        <Box as='ul' listStyleType='disc' ml={4}>
          {rules.map((item) => (
            <Text key={item} as='li'>
              {item}
            </Text>
          ))}
        </Box>
      )}
    </FormErrorMessage>
  );
}
