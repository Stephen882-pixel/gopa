import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { t } from "ttag";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import Image from "@src/components/Image";
import { WidePanel, ToolPanel } from "@src/components/layout";

import { slugify } from "@src/app/utils";
import { useLocale } from "@src/app/hooks";
import { publications } from "@src/template/data";

export default function Publication() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { formatDate } = useLocale();
  const item = publications.filter((p:any) => slug === slugify(p.title)).pop();

  React.useEffect(() => {
    document.title = t`View Publication`;
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Container sx={{ display: "flex", pb: 3 }}>
        <WidePanel>
          <Typography
            variant="h3"
            sx={{
              pt: { xs: 8, sm: 12 },
              pb: { xs: 3, sm: 5 },
            }}
          >
            {item?.title}
          </Typography>
          <br />
          {formatDate(new Date(), "do MMMM yyyy")}
        </WidePanel>
        <ToolPanel sx={{ display: "flex" }}>
          <Image src={item?.img} width={256} alt={t`publication image`} />
        </ToolPanel>
      </Container>
      <Divider />
      <Container
        sx={{
          display: "flex",
          pt: 3,
          pb: 3,
        }}
      >
        <WidePanel>
          <Button
            variant="contained"
            aria-label={t`Back`}
            color="primary"
            onClick={() => navigate(-1)}
          >
            {t`Back`}
          </Button>
        </WidePanel>
        <ToolPanel>
          <Button
            variant="contained"
            aria-label={t`Download PDF`}
            color="primary"
          >
            {t`Download PDF`}
          </Button>
        </ToolPanel>
      </Container>
      <Divider />
      <Container
        sx={{
          pt: 3,
          pb: 3,
        }}
      >
        <h2>Summary</h2>
        <p>Lorem ipsum odor amet, consectetuer adipiscing elit. Volutpat tempor interdum egestas ultrices maximus aptent mi. Potenti est vehicula est cubilia curabitur sit. Consectetur consectetur non quam commodo consectetur libero. Felis egestas interdum penatibus ullamcorper aenean magna curae amet. Lorem pellentesque magnis egestas taciti magna at fames. Tellus convallis porta nisl fames imperdiet nunc. Bibendum cras vehicula suspendisse sagittis torquent nam tristique.</p>

        <p>Ornare id fusce nisi augue varius facilisis orci. Tempus aptent himenaeos nullam nulla; consequat volutpat eu. Litora finibus mus a vitae lacinia nostra vehicula mus. Porttitor enim nunc sociosqu blandit id venenatis accumsan. Posuere libero congue nibh dolor at vivamus orci vitae. Rhoncus placerat neque elit imperdiet fermentum. Nec urna curabitur aliquam nulla dolor consequat elit lacinia. Orci phasellus conubia, semper natoque litora curae accumsan. Facilisi nisi fringilla fringilla pharetra ultrices arcu hendrerit eros orci.</p>

        <p>Nisi dignissim sapien eros magnis risus in ipsum. Adipiscing aptent turpis praesent euismod parturient, ut gravida eleifend. Condimentum ligula pretium augue habitasse nec. Ultricies id non taciti donec finibus convallis. Morbi nisi erat feugiat risus lacus enim. Convallis justo a consequat eros sociosqu laoreet est sagittis. Luctus neque eu velit dolor mollis molestie litora. Ante ut aliquet faucibus id nibh laoreet inceptos dis. Dis torquent venenatis natoque euismod netus montes.</p>

        <p>Placerat eros scelerisque odio sem vivamus himenaeos phasellus placerat euismod. Et pellentesque aenean tempus efficitur cursus libero ipsum suscipit. Hac egestas finibus pharetra fusce lacus sit sed commodo. Quam torquent enim praesent suscipit litora. Fringilla pharetra tellus vel eu volutpat suspendisse. Ultrices taciti sapien amet eget proin proin hendrerit sociosqu aliquet. Sociosqu elementum habitasse in nullam dictum. Dui elementum turpis etiam amet, libero amet nulla feugiat? Urna nibh urna vitae maximus luctus magna.</p>

        <p>Facilisis ultricies fringilla ultricies magna iaculis sollicitudin. Felis torquent interdum sociosqu dui; montes porttitor. Magna morbi hac tempor consectetur ullamcorper tortor. Ad finibus cras diam turpis dignissim suscipit lobortis. Consequat netus tincidunt ad elementum mi egestas lectus. Fusce orci nam aliquet; maximus bibendum ante justo duis curabitur. Justo habitasse felis proin sapien curae mollis finibus sagittis. Euismod nulla ornare neque nisl torquent pellentesque curae nascetur porta.</p>
      </Container>
    </>
  );
}
