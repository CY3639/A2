import { createTheme, rem } from '@mantine/core';
 
export const theme = createTheme({
  // primary colour - a calm clinical blue-teal for a pharmacy context
  primaryColor: 'teal',
  primaryShade: 7,
 
  // typography - readable at all sizes, accessible contrast
  fontFamily: 'Segoe UI, system-ui, sans-serif',
  fontSizes: {
    xs: rem(11),
    sm: rem(13),
    md: rem(15),
    lg: rem(17),
    xl: rem(20),
  },
 
  // make all Buttons filled by default - consistent UI
  components: {
    Button: {
      defaultProps: {
        variant: 'filled',
        radius: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
        shadow: 'sm',
      },
    },
  },
});
