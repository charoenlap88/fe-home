import { Stack } from '@mantine/core';

const PageWrapper = ({ children, ...props }) => {
  return (
    <Stack gap="md" {...props}>
      {children}
    </Stack>
  );
};

export default PageWrapper;
