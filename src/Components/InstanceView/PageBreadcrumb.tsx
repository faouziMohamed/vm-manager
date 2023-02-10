import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@chakra-ui/react';
import { IoChevronForward } from 'react-icons/io5';

import ChakraLink from '@/Components/ChakraLink';

type PageBreadcrumbProps = {
  shouldRenderName: string | undefined;
  currentPageLink: string;
  serverName: string;
};
export default function PageBreadcrumb(props: PageBreadcrumbProps) {
  const { shouldRenderName, currentPageLink, serverName } = props;
  return (
    <>
      <Breadcrumb pt='3' separator={<IoChevronForward />}>
        <BreadcrumbItem>
          <BreadcrumbLink as={ChakraLink} href='/'>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {!!shouldRenderName && (
          <BreadcrumbItem>
            <BreadcrumbLink
              as={ChakraLink}
              href={currentPageLink}
              fontWeight='500'
              fontSize='0.94rem'
            >
              {serverName}
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        )}
      </Breadcrumb>
      <style jsx global>
        {`
          .chakra-breadcrumb__list-item span {
            margin: 0;
            padding-inline: 0.2rem;
          }
        `}
      </style>
    </>
  );
}
