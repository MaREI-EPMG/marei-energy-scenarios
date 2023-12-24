// contains EPMG customisation
import React from "react";
import EnergyCharts from "energy-charts";
import useFetch from "energy-charts/src/hooks/useFetch";
import {
  chartsInfo as commonChartsInfo,
  chartsTitles as commonChartsTitles,
  seriesTitles as commonSeriesTitles,
  scenarioTitles as commonScenarioTitles,
  scenarios as commonScenarios,
  routes as commonRoutes,
  contentNavs as commonContentNavs
} from "../specs";

const chartsPath = "results/*";
const headerNavLinks = [
  { to: "results", text: "Charts" },
  { to: "about", text: "About this study" }
];
const headerNavBrand = { brand: "All studies", to: "/" };
const periods = Array.from(Array(31), (e, i) => 2020 + i);

function Portal(props) {
  const { source, study, cache, alert } = props;

  const [isRepoChartsInfoLoading, repoChartsInfo] = useFetch(
    `${source}/${study}/specs/chartsInfo.json`,
    cache
  );

  const [isRepoChartsTitlesLoading, repoChartsTitles] = useFetch(
    `${source}/${study}/specs/chartsTitles.json`,
    cache
  );

  const [isRepoSeriesTitlesLoading, repoSeriesTitles] = useFetch(
    `${source}/${study}/specs/seriesTitles.json`,
    cache
  );

  const [isRepoScenarioTitlesLoading, repoScenarioTitles] = useFetch(
    `${source}/${study}/specs/scenarioTitles.json`,
    cache
  );

  const [isRepoScenariosLoading, repoScenarios] = useFetch(
    `${source}/${study}/specs/scenarios.json`,
    cache
  );

  const [isRepoRoutesLoading, repoRoutes] = useFetch(
    `${source}/${study}/specs/routes.json`,
    cache
  );

  const [isRepoContentNavsLoading, repoContentNavs] = useFetch(
    `${source}/${study}/specs/contentNavs.json`,
    cache
  );

  const chartsInfo = repoChartsInfo ? repoChartsInfo : commonChartsInfo;
  const chartsTitles = repoChartsTitles ? repoChartsTitles : commonChartsTitles;
  const seriesTitles = repoSeriesTitles ? repoSeriesTitles : commonSeriesTitles;
  const scenarioTitles = repoScenarioTitles
    ? repoScenarioTitles
    : commonScenarioTitles;
  const scenarios = repoScenarios ? repoScenarios : commonScenarios[study];
  const routes = repoRoutes ? repoRoutes : commonRoutes;
  const contentNavs = repoContentNavs ? repoContentNavs : commonContentNavs;

  const isDataLoading =
    isRepoChartsInfoLoading ||
    isRepoChartsTitlesLoading ||
    isRepoSeriesTitlesLoading ||
    isRepoScenarioTitlesLoading ||
    isRepoScenariosLoading ||
    isRepoRoutesLoading ||
    isRepoContentNavsLoading;

  const config = !isDataLoading
    ? {
        alert: alert,
        barWidth: 12,
        basePath: `${source}/${study}`,
        chartPadding: { left: 40, right: 20, top: 50, bottom: 35 },
        chartsInfo: chartsInfo,
        chartsPath: chartsPath,
        contentNavs: contentNavs,
        dataDownload: true,
        defaultScenarioGroup: scenarios[0].name,
        fixedDomain: false,
        headerNavBrand: headerNavBrand,
        headerNavLinks: headerNavLinks,
        landingPage: "about",
        maxChartWidth: 600,
        routes: routes,
        scenarios: scenarios,
        showSearchParams: true,
        stackbarOffset: 5,
        titles: {
          charts: chartsTitles,
          series: seriesTitles,
          scenarios: scenarioTitles
        },
        xDomainPadding: 10,
        xGridValues: periods
      }
    : {};

  return !isDataLoading && <EnergyCharts config={config} />;
}

export default Portal;
