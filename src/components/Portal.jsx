import React from "react";
import EnergyCharts from "../energy-charts";
import useFetch from "../energy-charts/hooks/useFetch";
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
const headerNavLinks = [{ to: "results", text: "Results" }];
const headerNavBrand = { brand: "Energy Scenarios", to: "/" };
const periods = Array.from(Array(31), (e, i) => 2020 + i);
const alert = {
  heading: "Work in progress...",
  text: "Please don't cite or use these results.",
  variant: "danger"
};

function Portal(props) {
  const { source, study, cache } = props;

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
        chartsInfo: chartsInfo,
        chartsPath: chartsPath,
        dataDownload: true,
        titles: {
          charts: chartsTitles,
          series: seriesTitles,
          scenarios: scenarioTitles
        },
        scenarios: scenarios,
        defaultScenarioGroup: scenarios[0].name,
        landingPage: "about",
        routes: routes,
        contentNavs: contentNavs,
        headerNavLinks: headerNavLinks,
        headerNavBrand: headerNavBrand,
        basePath: `${source}/${study}`,
        xGridValues: periods,
        maxChartWidth: 600,
        xDomainPadding: 11,
        stackbarOffset: 7,
        barWidth: 12,
        chartPadding: { left: 40, right: 20, top: 50, bottom: 35 }
      }
    : {};

  return !isDataLoading && <EnergyCharts config={config} />;
}

export default Portal;
