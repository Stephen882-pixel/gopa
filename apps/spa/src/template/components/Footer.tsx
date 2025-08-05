import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

import { ThemeProvider } from "@mui/material";
import { t } from "ttag";

import { getTheme } from "@src/components/theme/init";

export default function Footer() {
  return (
    <ThemeProvider theme={getTheme(true)}>
      <Box
        className="footer-style-1A"
        sx={(theme) => ({
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        })}
      >
        <Container
          className="footer-style-1B"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: { sm: "center", md: "left" },
          }}
        >
          <Box
            className="footer-style-1C"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: { xs: 4, sm: 8 },
              pb: { xs: 4, sm: 8 },
              width: "100%",
            }}
          >
            <div className="footer-style-1D">
              <img src="/static/spa/logo/05.png" style={{ height: "30px", width: "auto" }} />
              <Typography variant="body2">
                {t`Implemented by GOPA Worldwide Consultants GmbH`}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                &copy;&nbsp;
                <Link color="text.secondary" href="https://www.eac.int" target="_blank">
                  East African Community
                </Link>
                &nbsp;
                {new Date().getFullYear()}
              </Typography>
            </div>
            <Stack
              className="footer-style-1E"
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ justifyContent: "left", color: "text.secondary" }}
            >
              <IconButton
                color="inherit"
                size="small"
                target="_blank"
                href="https://twitter.com/jumuiya"
                aria-label="X"
                sx={{ alignSelf: "center" }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                target="_blank"
                href="https://www.facebook.com/proudlyeastafrican/"
                aria-label="Facebook"
                sx={{ alignSelf: "center" }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                target="_blank"
                href="https://www.instagram.com/eac_secretariat1/"
                aria-label="Instagram"
                sx={{ alignSelf: "center" }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                target="_blank"
                href="https://www.youtube.com/channel/UC_Nt3M0n4ftThoVVQMK_D3A"
                aria-label="YouTube"
                sx={{ alignSelf: "center" }}
              >
                <YouTubeIcon />
              </IconButton>
            </Stack>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
