import * as React from "react";
import { useNavigate } from "react-router-dom";
import { t } from "ttag";
import { useTheme, alpha } from "@mui/material/styles";


import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
// import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SearchSharp from "@mui/icons-material/SearchSharp";

import BannerBox from "@src/template/components/Box/BannerBox";

import { makeId, toTitleCase } from "@src/app/utils";
import { useAppSelector } from "@src/app/redux/store";
import AboutUs from "./AboutUs";


export default function Hero() {
  const theme = useTheme();

  const [opts, setOpts] = React.useState({
    search: "restrictions",
    slug: null,
    iso: null,
  });
  const setOpt = (key: string, value: string) => setOpts({ ...opts, [key]: value });

  const navigate = useNavigate();

  const countries = useAppSelector((state) => state.constants.countries);
  const sectors = (useAppSelector((state) => state.cache.sectorList) as any[])
    .filter((c) => c.parent === null)
    .map((c) => ({
      slug: c.slug,
      label: toTitleCase(c.label),
    }));

  const backgroundImage = `radial-gradient(ellipse 80% 50% at 50% -20%, ${alpha(
    theme.palette.primary.main,
    0.25
  )}, transparent)`;

  const darkBackgroundImage = `radial-gradient(ellipse 80% 50% at 50% -20%, ${alpha(
    theme.palette.primary.main,
    0.16
  )}, transparent)`;

  const lblId = makeId(12);

  const searchBoxStyles = {
    width: { xs: "100%", sm: "70%" },
    display: "flex",
    flexDirection: "column",
    backgroundColor: alpha(theme.palette.background.paper, 0.75),
    borderRadius: theme.spacing(0.5),
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    gap: theme.spacing(1),
  };

  const headingStyles = {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: "center",
    fontSize: "clamp(3rem, 10vw, 3.5rem)",
    padding: theme.spacing(2, 0, 2, 2),
    borderRadius: theme.spacing(0.5),
    backgroundColor: alpha(theme.palette.background.paper, 0.75),
  };

  return (
    <Box
      className="box-style-1"
      sx={{
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundImage,
        ...theme.applyStyles("dark", {
          backgroundImage: darkBackgroundImage,
        }),
      }}
    >
      <BannerBox
        bg={{
          interval: 5,
          // url: [
          //   "/static/spa/bg/01-<scheme>.jpg",
          //   "/static/spa/bg/02-<scheme>.jpg",
          //   "/static/spa/bg/03-<scheme>.jpg",
          //   "/static/spa/bg/04-<scheme>.jpg",
          //   "/static/spa/bg/05-<scheme>.jpg",
          //   "/static/spa/bg/06-<scheme>.jpg",
          //   "/static/spa/bg/07-<scheme>.jpg",
          // ],
          url: [
            "/static/spa/bg/A3.jpg",
            "/static/spa/bg/A4.jpg",
            "/static/spa/bg/A6.jpg",
            "/static/spa/bg/A7.jpg",
            "/static/spa/bg/A8.jpg",
            "/static/spa/bg/A9.jpg",
            "/static/spa/bg/A10.jpg",
            "/static/spa/bg/A11.jpg",
            "/static/spa/bg/A12.jpg",
          ],
        }}
      >
        <Container
          className="container-style-1"
          sx={{
            pt: { xs: 10, sm: 15 },
            // pb: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="hero_wrapper">
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
          >
            <Typography
              variant="h1"
              className="heading-style-1"
              sx={headingStyles}
            >
              {t`The EAC Mechanism for the Removal of Restrictions on Trade in Services`}
            </Typography>
          </Stack>

          <Box className="hello_search_box" sx={searchBoxStyles}>

            {/* Search by */}
            <Box>
              {/* <FormLabel id={lblId}>{t`Search By`}</FormLabel> */}
              <RadioGroup
                row
                aria-labelledby={lblId}
                defaultValue="restrictions"
                onChange={(event, value) => setOpt("search", value)}
              >
                <FormControlLabel value="restrictions" label={t`Restrictions`} control={<Radio />} />
                <FormControlLabel value="complaints" label={t`Complaints`} control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* Countries */}
            <Select
              fullWidth
              defaultValue="all"
              onChange={(event: SelectChangeEvent) =>
                setOpt("iso", event.target.value as string)
              }
            >
              <MenuItem value="all">{t`All Countries`}</MenuItem>
              {countries?.map((cat, index) => (
                <MenuItem key={index} value={cat.slug}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>

            {/* Sectors */}
            <Select
              fullWidth
              defaultValue="all"
              onChange={(event: SelectChangeEvent) =>
                setOpt("slug", event.target.value as string)
              }
            >
              <MenuItem value="all">{t`All Sectors`}</MenuItem>
              <Divider />
              {sectors?.map((item, index) => (
                <MenuItem key={index} value={item.slug}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>


            {/* Search button */}
            <Box sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", flexGrow: 1 }} />
              <Button
                className="button-wrapper-A"
                color="primary"
                variant="contained"
                aria-label={t`Search`}
                onClick={() => {
                  if ( "complaints" === opts.search ) {
                    let q = [];
                    if (opts.slug) q.push(`sector=${opts.slug}`);
                    if (opts.iso) q.push(`iso=${opts.iso}`);
                    navigate(`/public/complaints/list${q.length > 0 ? `?${q.join("&")}` : ""}`);
                  }
                  else {
                    let pth = "/public/browse";
                    if (opts.slug) {
                      pth = `${pth}/${opts.slug}`;
                    }
                    if (opts.iso) {
                      pth = `${pth}?iso=${opts.iso}`;
                    }
                    navigate(pth);
                  }
                }}
              >
                <span>Search</span>
                <SearchSharp />
              </Button>
            </Box>

          </Box>
          </div>
        </Container>
      </BannerBox>

      <Container
        className="container-style-2"
        sx={{
          pt: 4,
          pb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AboutUs />
      </Container>

    </Box>
  );
}
