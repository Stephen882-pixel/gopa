import { Theme, Components } from "@mui/material/styles";

export const components = (divider: string): Components<Theme> => ({
  // // Name of the component
  // MuiButtonBase: {
  //   defaultProps: {
  //     // The props to change the default for.
  //     disableRipple: true, // No more ripple, on the whole application 💣!
  //   },
  //   styleOverrides: {
  //     // Name of the slot
  //     root: {
  //       textTransform: "none",
  //     },
  //   },
  // },

  MuiLink: {
    defaultProps: {
      underline: "none",
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottomColor: divider,
      },
      head: {
        fontWeight: 700,
      },
    },
  },

  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
      },
    },
  },

  // https://mui.com/material-ui/react-tooltip/#distance-from-anchor
  MuiPopper: {
    defaultProps: {
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, -10],
          },
        },
      ],
    },
  },
});
