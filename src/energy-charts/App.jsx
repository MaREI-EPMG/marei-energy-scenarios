// contains EPMG customisation
import React, { useState, useRef, useEffect, Suspense } from "react";
import {
  createSearchParams,
  Routes,
  Route,
  Navigate,
  useSearchParams
} from "react-router-dom";
import useMediaQuery from "./hooks/useMediaQuery";
import { Layout } from "./containers";
import { PageLoading, ChartsPage, Charts, Page } from "./components";

function App({ config }) {
  const decodeSearchParams = (searchParams) => {
    return [...searchParams.entries()].reduce((acc, [key, val]) => {
      try {
        return {
          ...acc,
          [key]: JSON.parse(val)
        };
      } catch {
        return {
          ...acc,
          [key]: val
        };
      }
    }, {});
  };

  const [encodedSearchParams, setSearchParams] = useSearchParams();
  const searchParams = decodeSearchParams(encodedSearchParams);
  const dataDownload = config.dataDownload;
  const showSearchParams = config.showSearchParams;

  const scenarioGroups = config.scenarios.map(
    (scenarioGroup) => scenarioGroup.name
  );

  const defaultScenarioGroup = config.defaultScenarioGroup
    ? scenarioGroups.includes(config.defaultScenarioGroup)
      ? config.defaultScenarioGroup
      : scenarioGroups[0]
    : scenarioGroups[0];

  const loadMainScenario =
    "scen1" in searchParams
      ? scenarioGroups.includes(searchParams.scen1)
        ? searchParams.scen1
        : defaultScenarioGroup
      : defaultScenarioGroup;

  const loadCompareScenario =
    "scen2" in searchParams
      ? scenarioGroups.includes(searchParams.scen2)
        ? searchParams.scen2
        : null
      : null;

  const loadShowDifference =
    "diff" in searchParams
      ? !!searchParams.diff === true && loadCompareScenario
      : false;

  const [mainScenario, setMainScenario] = useState(loadMainScenario);
  const [compareScenario, setCompareScenario] = useState(loadCompareScenario);
  const [showDifference, setShowDifference] = useState(loadShowDifference);

  const cache = useRef({});

  const maxChartWidth = config.maxChartWidth ? config.maxChartWidth : 450;
  const applyMaxChartWidth = useMediaQuery(`(min-width: ${maxChartWidth}px)`);
  const chartWidth = applyMaxChartWidth ? maxChartWidth : 450;
  const chartWidthScaling = chartWidth / maxChartWidth;

  const titles = {
    chartsTitles: config.titles.charts,
    scenarioTitles: config.titles.scenarios,
    seriesTitles: config.titles.series
  };

  useEffect(() => {
    if (!compareScenario) {
      setShowDifference(false);
    }

    showSearchParams
      ? setSearchParams(
          createSearchParams({
            "scen1": mainScenario,
            "scen2": compareScenario,
            "diff": showDifference
          })
        )
      : setSearchParams();
  }, [
    mainScenario,
    compareScenario,
    showDifference,
    setSearchParams,
    showSearchParams
  ]);

  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Layout {...config} />}>
          {config.landingPage ? (
            <Route
              index
              element={<Navigate to={config.landingPage} replace={true} />}
            />
          ) : (
            <Route
              index
              element={
                <Page cache={cache} basePath={config.basePath} name="index" />
              }
            />
          )}
          <Route
            path=":pageId"
            element={<Page cache={cache} basePath={config.basePath} />}
          />
          <Route
            path={config.chartsPath}
            element={
              <ChartsPage
                {...config}
                selectedScenarios={[mainScenario, compareScenario]}
                showDifference={showDifference}
                setMainScenario={setMainScenario}
                setCompareScenario={setCompareScenario}
                setShowDifference={setShowDifference}
              />
            }
          >
            <Route
              index
              element={<Navigate to={config.routes[0].path} replace={true} />}
            />
            {config.routes.map((route, idx) => (
              <Route
                key={idx}
                path={route.path}
                element={
                  route.charts && (
                    <Charts
                      selectedScenarios={[mainScenario, compareScenario]}
                      showDifference={showDifference}
                      basePath={config.basePath}
                      charts={route.charts}
                      chartsInfo={config.chartsInfo}
                      cache={cache}
                      xDomainPadding={config.xDomainPadding}
                      xGridValues={config.xGridValues}
                      xGridMarks={config.xGridMarks}
                      fixedDomain={config.fixedDomain}
                      chartWidth={chartWidth}
                      chartWidthScaling={chartWidthScaling}
                      stackbarOffset={config.stackbarOffset}
                      padding={config.chartPadding}
                      barWidth={config.barWidth}
                      dataDownload={dataDownload}
                      {...titles}
                    />
                  )
                }
              >
                {route.routes && (
                  <>
                    <Route
                      index
                      element={
                        <Navigate to={route.routes[0].path} replace={true} />
                      }
                    />
                    {route.routes.map((route, idx) => (
                      <Route
                        key={idx}
                        path={route.path}
                        element={
                          route.charts && (
                            <Charts
                              selectedScenarios={[
                                mainScenario,
                                compareScenario
                              ]}
                              showDifference={showDifference}
                              basePath={config.basePath}
                              charts={route.charts}
                              chartsInfo={config.chartsInfo}
                              cache={cache}
                              xDomainPadding={config.xDomainPadding}
                              xGridValues={config.xGridValues}
                              xGridMarks={config.xGridMarks}
                              fixedDomain={config.fixedDomain}
                              chartWidth={chartWidth}
                              chartWidthScaling={chartWidthScaling}
                              stackbarOffset={config.stackbarOffset}
                              padding={config.chartPadding}
                              barWidth={config.barWidth}
                              dataDownload={dataDownload}
                              {...titles}
                            />
                          )
                        }
                      />
                    ))}
                  </>
                )}
              </Route>
            ))}
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
