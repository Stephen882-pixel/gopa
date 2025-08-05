import * as React from "react";
import { t } from "ttag";
import { useTheme } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";

import Container from "@mui/material/Container";
import HeroPanel from "@src/template/components/Panels/HeroPanel";

import SectorListCard from "./SectorListCard";

export default function AboutUs() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const secA = React.useRef<null | HTMLHeadingElement>(null);
  const secB = React.useRef<null | HTMLHeadingElement>(null);
  const secC = React.useRef<null | HTMLHeadingElement>(null);

  const getBound = () => {
    switch(window.location.hash) {
    case "#section-a":
      return secA?.current?.getBoundingClientRect();
    case "#section-b":
      return secB?.current?.getBoundingClientRect();
    case "#section-c":
      return secC?.current?.getBoundingClientRect();
    }
  };

  React.useEffect(() => {
    document.title = t`About Us`;

    const bound = getBound();
    const navHeight = matches ? 155: 90;
    window.scrollTo(0, bound?.top ? bound.top - navHeight : 0);
  }, []);

  return (
    <>
      <div className="header-style-2">
        <HeroPanel
          small
          transparent
          bg={{
            url: "/static/spa/bg/05-light-original2.jpg",
          }}
          title={t`About Us`}
          brief="Breaking Barriers: The East African Community’s Portal for Trade in Services"
        />
      </div>

      <Container className="main-style-1">
        <p className="lead">
          The East African Community (EAC) has taken a significant step towards enhancing regional economic integration with the launch of a new website dedicated to removing restrictions on trade in services. This innovative platform is set to foster a more seamless and competitive market by eliminating barriers that hinder businesses and professionals from offering their services across member states.
        </p>

        <div className="section-style-3">
          <h2 className="h1" ref={secA}>Understanding Trade in Services</h2>
          <p>
            Article I of the General Agreement on Trade in Services (GATS), which is the basis of the EAC Common Market Protocol, provides three key elements constituting the agreement's “definition of services and sectoral coverage.”  To understand trade in services, its supply includes “the production, distribution, marketing, sale and delivery of a service” through any of the four modes based on the territorial presence of the supplier and the consumer at the time of the transaction. These are the:-
          </p>
          <ol>
            <li>from the territory of one Member into the territory of any other Member (<b>Mode 1–Cross-border trade</b>)</li>
            <li>in the territory of one Member to the service consumer of any other Member (<b>Mode 2–Consumption abroad</b>)</li>
            <li>by a service supplier of one Member, through commercial presence, in the territory of any other Member (<b>Mode 3–Commercial presence</b>); and</li>
            <li>by a service supplier of one Member, through the presence of natural persons of a Member in the territory of any other Member (<b>Mode 4–Presence of natural persons</b>)</li>
          </ol>
          <p>Trade in services encompasses a wide range of sectors, as elaborated by the Services Sectoral Classification List, which includes 12 sectors with more detail in the UN Central Product Classification List, which includes:- </p>
        </div>


        <div className="section-style-4">
          <SectorListCard />
        </div>

        <div className="section-style-3">
          <p>What  is included from the EAC Common Market Protocol:-</p>
          <ul>
            <li>Framework principles in the form of General Obligations and Disciplines on specific commitments by Partner states in seven priority sectors.</li>
            <li>Schedules of Specific Commitments in the seven (7) priority sectors: business services, Communication services, education services, construction and engineering services, distribution services, financial services, transport services, and Tourism and travel-related services.</li>
            <li>Mandate for progressive liberalisation through successive negotiations for additional sectors.</li>
          </ul>
          <p>What is excluded from the EAC Common Market Protocol:-</p>
          <ul>
            <li>Services supplied in the Exercise of Governmental Authority, on a Non-commercial basis, not in competition with any other supplier, Fire service, police, electricity and water services</li>
            <li>Air Traffic Rights</li>
          </ul>
        </div>

        <div className="section-style-3">
          <h2 ref={secB}>What Are Restrictions on Trade in Services?</h2>
          <p>Restrictions on trade in services are more complex than restrictions on trade in goods. Restrictions on goods trade usually take the form of tariffs. These directly affect the price of foreign goods only, which can be measured relatively easily by the size of the tariff. In contrast, restrictions on trade in services usually take the form of government regulation. These regulations (law, regulation, rule, procedure, decision, administrative action or any other form) can affect the entry and operations not only of foreign service suppliers, but also of new domestic service suppliers, and this can directly raise the price or cost of both foreign and domestically supplied services.</p>
          <p>There are various ways to classify restrictions. These are:</p>
          <ol>
            <li>Market access Vs National treatment (affecting market entry decisions vs affecting operations of service suppliers)</li>
            <li>discriminatory vs non-discriminatory ( domestic and foreign service suppliers are treated differently vs domestic and foreign service suppliers are not treated differently )</li>
            <li>de jure vs de facto discrimination (measures that discriminate serve suppliers EXPLICITLY on the basis of their origin or nationality Vs measures that do not formally discriminate service suppliers on the basis of origin or nationality but in practice offer less favourable treatment to foreign service suppliers than their domestic counterparts)</li>
          </ol>
        </div>

        <div className="section-style-3">
          <h3>Market Access vs National Treatment</h3>
          <p><b>Market access limitations</b> in service trade refer to restrictions or barriers that a country imposes on foreign service providers, preventing them from freely entering and operating within its market. These restrictions limit companies&#39; ability to sell their services across borders, often due to regulations, licensing requirements, or protectionist policies aimed at domestic industries.</p>
          <p>Common barriers to market access:</p>
          <ul>
            <li>Foreign capital participation/ Type of legal entity or joint venture</li>
            <li>Licensing and registration requirements: Complex or overly stringent licensing procedures for foreign service providers.</li>
            <li>Professional qualifications recognition: Not recognising foreign professional qualifications, requiring additional exams or training to operate locally.</li>
            <li>Number of operations or quantity of output/Local content requirements: Mandating a certain percentage of local workforce or inputs to be used by foreign service providers.</li>
            <li>Data localisation rules: Restrictions on storing or processing data within the country, impacting cloud computing services.</li>
            <li>Market access quotas: Limiting the number of foreign service providers allowed to operate in a specific sector.</li>
            <li>Government procurement restrictions: Preferential treatment for domestic companies in government contracts</li>
          </ul>
          <p>National treatment limitations in trade in services refer to specific exceptions or restrictions that a country can place on its commitment to treating foreign service providers no less favourably than domestic ones. These limitations essentially allow countries to carve out areas where they can discriminate against foreign services, as outlined in their schedules of commitments.</p>
          <p>Common Barriers: National Treatment Restrictions</p>
          <ul>
            <li>Sector-specific restrictions: A country might commit to national treatment for most services but exclude specific sectors like banking or healthcare due to domestic concerns.</li>
            <li>Mode of supply limitations: A country might only commit to national treatment for foreign service providers operating through specific modes, like cross-border supply, but not commercial presence.</li>
            <li>Licensing, qualification and registration requirements/Qualification requirements: A country might set specific qualifications or licensing requirements for foreign service providers that are not applied to domestic providers.</li>
            <li>Discriminatory subsidies and other financial measures: Eligibility for R&amp;D subsidies reserved for nationals, limitations on insurance portability, use of education grants, etc.</li>
            <li>Nationality of certain personnel and residency requirements: The majority of Board members must be citizens of the country concerned</li>
            <li>Tax measures : A federal excise tax is imposed on insurance premiums paid to non-domestically incorporated</li>
            <li>Discriminatory fees or charges : Charges taken for port services may be higher for foreign than national-flag vessels</li>
            <li>Local content requirements - Preferential use of local services that are available at competitive prices and levels of quality</li>
            <li>Technology transfer/training requirements</li>
            <li>Prohibitions on land/property ownership</li>
          </ul>
        </div>


        <div className="section-style-3">
          <h2 ref={secC}>Mechanisms for Removing Trade in Services Restrictions</h2>
          <p>The new EAC website provides businesses, policymakers, and professionals with the tools to identify and address these barriers effectively. Some of the key mechanisms include:</p>
          <ul>
            <li><em>Transparency and Information Sharing</em> – The website features a comprehensive database of existing restrictions, helping businesses and service providers understand the challenges they may face.</li>
            <li><em>Policy Reforms and Advocacy</em> – By highlighting restrictive measures, the platform encourages dialogue among member states to implement policy changes that align with EAC integration goals.</li>
            <li><em>Harmonization of Regulations</em> – The EAC aims to streamline regulatory frameworks across the region, ensuring that service providers can operate under uniform standards and procedures.</li>
            <li><em>Dispute Resolution Mechanisms</em> – The website provides guidance on resolving conflicts arising from trade restrictions, fostering fair and equitable trade practices.</li>
          </ul>

          <div className="sms-form-A content-style-3">
            <h2>Conclusion</h2>
            <p>The launch of this website marks a milestone in the EAC’s journey toward a truly integrated regional market. By tackling barriers to trade in services, businesses and professionals across East Africa can unlock new opportunities, drive economic growth, and enhance cooperation. As the platform evolves, it is expected to become a cornerstone in the realization of a more competitive and dynamic East African services sector.</p>
          </div>

        </div>
      </Container>
    </>
  );
}
