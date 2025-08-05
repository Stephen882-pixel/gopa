import * as React from "react";
import { t } from "ttag";
import { styled } from "@mui/material/styles";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import PSelect from "@src/components/input/PSelect";
import HeroPanel from "@src/template/components/Panels/HeroPanel";
import { useAppSelector } from "@src/app/redux/store";

const ULText = styled("p")({ margin: 0 });
const ULTitle = styled(ULText)({
  fontWeight: "bold",
});

export default function SMSHowTo() {
  const countries = useAppSelector((state) => state.constants.countries);
  const [enabled, setEnabled] = React.useState<any>({});
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    document.title = t`SMS Service`;
    window.scrollTo(0, 0);
    setValue(t`Please specify the country of operation`)
    setEnabled({});
  }, []);

  return (
    <>
      {/* <HeroPanel
        small transparent
        title={t`SMS Service`}
        brief={t`how to send SMS reports to us`}
      /> */}


      <div className="header-style-2">
        <HeroPanel
          small
          transparent
          bg={{
            url: "/static/spa/bg/03-light-original2.jpg",
          }}
          title={t`SMS Service`}
          brief="How to send SMS reports to us"
        />
      </div>


      <Container className="main-style-1">

        <div className="sms-form-A">
          <h4>Select a country to get specific SMS information</h4>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <PSelect
                fullWidth
                label={t`Country`}
                onChange={(val) => {
                  setValue(enabled[val] || t`This country has not yet activated/installed the SMS reporting functionality`);
                }}
              >
                {countries?.map((co, index) => <MenuItem key={index} value={co.slug}>{co.label}</MenuItem>)}
              </PSelect>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t`National Focal Point`}
                value={value}
              />
            </Grid>
          </Grid>
        </div>

        <p className="lead">
          {t`Are you a service provider facing challenges while offering services while operating in the EAC Partner States? We are here to help. Our SMS service lets you quickly and easily report any restrictions you are experiencing. It is fast, convenient, and designed with you in mind. Here is how to make the most of it.`}
        </p>

        <div className="section-style-3">
          <h3>{t`What to Include in Your SMS`}</h3>
          <p>{t`When sending your report, be sure to include the following details so we can assist you effectively:`}</p>
          <ul>
            <li>
              <ULTitle>{t`What is the problem?`}</ULTitle>
              <ULText>{t`Describe the challenge/restriction you are facing (e.g. restriction on market entry, restriction while operating, licensing requirements, etc.).`}</ULText>
            </li>
            <li>
              <ULTitle>{t`When did it happen?`}</ULTitle>
              <ULText>{t`Give us the date and time if possible.`}</ULText>
            </li>
            <li>
              <ULTitle>{t`Where did it happen?`}</ULTitle>
              <ULText>{t`Mention the EAC partner state`}</ULText>
            </li>
            <li>
              <ULTitle>{t`Your Company/Trade Name`}</ULTitle>
              <ULText>{t`So we know who to follow up with.`}</ULText>
            </li>
            <li>
              <ULTitle>{t`Your contact info`}</ULTitle>
              <ULText>{t`Include your phone number so our team can reach you if needed.`}</ULText>
            </li>
          </ul>
        </div>

        {/*<div className="example_sms">
          <span className="example_label">{t`Example SMS`}</span>
          <p className="example_content">
            Delayed 3 hours at Malaba border, asked to pay unofficial fee. Happened today at 9 AM. Name: Okello Corp, 0712 345 678.
          </p>
        </div>*/}

        <div className="section-style-3">
          <h3>{t`What Happens After You Send the SMS?`}</h3>
          <ul>
            <li>{t`We log your case into our secure system.`}</li>
            <li>{t`Our support team reviews it and may contact you for more information.`}</li>
            <li>{t`We liaise with the relevant regulators/ministries to resolve the issue.`}</li>
            <li>{t`Your report helps us advocate for better policies and improved trade in services.`}</li>
          </ul>
          <p>
            <em>{t`We handle your information with care and confidentiality. By sharing your experience, you’re not just solving your problem—you’re helping improve trade for everyone.`}</em>
          </p>
        </div>
      </Container>
    </>
  );
}
