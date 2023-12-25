import chartsInfo from "./specs/chartsInfo";
import chartsTitles from "./specs/chartsTitles";
import seriesTitles from "./specs/seriesTitles";
import scenarioTitles from "./specs/scenarioTitles";

const config = {
  chartsInfo: chartsInfo,
  chartsPath: "charts/*",

  // dataDownload adds a link to chart cards to enable the viewer to
  //    download the data used to make the chart
  dataDownload: "true",

  // showSearchParams adds the scenario(s) and showDifference flag to
  //    URL, for sharing links to specific charts with other people
  showSearchParams: true,

  demo: true,

  // fixedDomain, if true, fixes the Y-axis scall across all charts.
  //    i.e. only the show-differences chart is auto-scaled
  //    You will need to provide MinY & MinY for each chart, in chartsInfo
  fixedDomain: true,

  // stackbarOffset, when comparing scenarios, this is the width in pixels
  //    that the bar for the compared scenario is offset by
  stackbarOffset: 5,

  xDomainPadding: 15, // spacing between end bars and ends of axes

  // xGridValues: a barstack for each value;
  //    here we fill it with 2020, 2025, 2030 ..., 2045, 2050
  xGridValues: Array(7)
    .fill(0)
    .map((e, i) => i * 5 + 2020),

  // xGridMarks: where labels appear on the x-axis
  //    here we fill it with 2020, 2025, 2030 ... 2045, 2050
  xGridMarks: Array(7)
    .fill(0)
    .map((e, i) => i * 5 + 2020),

  titles: {
    charts: chartsTitles,
    series: seriesTitles,
    scenarios: scenarioTitles
  },
  scenarios: [
    {
      name: "Scenario 1",
      variants: [{ name: "Scenario 1", specs: null }]
    },
    {
      name: "Scenario 2",
      variants: [{ name: "Scenario 2", specs: null }]
    },
    {
      name: "Scenario 3",
      variants: [{ name: "Scenario 3", specs: null }]
    },
    {
      name: "Scenario 4",
      variants: [{ name: "Scenario 4", specs: null }]
    }
  ],
  defaultScenarioGroup: "Scenario 1",
  landingPage: "about",
  routes: [
    {
      path: "group1",
      routes: [
        {
          path: "subgroup1",
          charts: ["chart 1", "chart 2", "chart 3", "chart 4"]
        },
        {
          path: "subgroup2",
          charts: ["chart 1", "chart 4", "chart 3", "chart 2"]
        }
      ]
    },
    {
      path: "group2",
      charts: ["chart 1", "chart 2", "chart 3", "chart 4"]
    }
  ],
  contentNavs: [
    {
      path: "*",
      links: [
        { to: "group1", text: "Group 1" },
        { to: "group2", text: "Group 2" }
      ],
      variant: "tabs"
    },
    {
      path: "group1/*",
      links: [
        { to: "subgroup1", text: "Subgroup 1" },
        { to: "subgroup2", text: "Subgroup 2" }
      ],
      variant: "underscore"
    }
  ],
  headerNavLinks: [
    { to: "/about", text: "About" },
    { to: "/charts", text: "Charts" }
  ],
  headerNavBrand: {
    brand: "Energy Charts",
    to: "/"
  }
};

export { config as default };
