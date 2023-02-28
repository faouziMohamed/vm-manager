import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@chakra-ui/react';
import { IoChevronForward } from 'react-icons/io5';

import { HOME_PAGE } from '@/lib/client-route';

import UnStyledLink from '@/Components/Links/UnStyledLink';

type PageBreadcrumbProps = {
  shouldRenderName: boolean;
  currentPageLink: string;
  serverName: string;
};
export default function PageBreadcrumb(props: PageBreadcrumbProps) {
  const { shouldRenderName, currentPageLink, serverName } = props;
  return (
    <>
      <Breadcrumb separator={<IoChevronForward />}>
        <BreadcrumbItem>
          <BreadcrumbLink as={UnStyledLink} href={HOME_PAGE}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {shouldRenderName && (
          <BreadcrumbItem>
            <BreadcrumbLink
              as={UnStyledLink}
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
