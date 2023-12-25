// contains EPMG customisation
import { mkConfig, generateCsv, download } from "export-to-csv";

function downloadTableData(chartData, chartName, unit, scenarioTitles, when) {
  var dataToFormat = [];
  var columnHeaders = [];
  var chartDesc = `Downloaded from\n${window.location.href}\n`;
  var scenarioHeaders = [];
  var needHeaders = true;
  var scenarioNames = {};
  var allScenarioNames = [];

  chartDesc +=
    window.location.pathname.replaceAll("/", " > ") +
    `\nGenerated at ${when}\n\n`;

  // take the chart data and turn it into a format suitable for formatting as CSV
  for (const scenario of chartData) {
    if (!scenario) {
      continue;
    }

    if (Array.isArray(scenario.name)) {
      scenarioNames = {};
      let i = 1;
      for (const name of scenario.name) {
        const thisHeader = `scenario ${i++}`;
        scenarioNames[thisHeader] = name;
        if (needHeaders) {
          allScenarioNames.push(name);
          scenarioHeaders.push(thisHeader);
        }
      }
      if (needHeaders) {
        needHeaders = false;
        chartDesc +=
          "Table values are calculated as: Scenario 1 - Scenario 2\n";
      }
    } else {
      scenarioNames.scenario = scenario.name;
      if (needHeaders) {
        scenarioHeaders.push("scenario");
        needHeaders = false;
      }
      if (!allScenarioNames.includes(scenario.name)) {
        allScenarioNames.push(scenario.name);
      }
    }

    for (const series of scenario.data) {
      let thisRow = Object.assign({}, scenarioNames);
      thisRow.series = series.seriesName;
      for (const seriesValues of series.seriesValues) {
        const year = seriesValues[0];
        thisRow[year] = parseFloat(seriesValues[1].toPrecision(4));
        if (!columnHeaders.includes(year)) columnHeaders.push(year);
      }
      dataToFormat.push(thisRow);
    }
  }

  columnHeaders.sort();
  columnHeaders.unshift("series");
  columnHeaders.unshift(...scenarioHeaders);

  var filename = chartName // sanitise
    /* eslint-disable-next-line no-control-regex */
    .replace(/[\x00-\x1f\x80-\x9f/?<>\\:*| "]/g, "_")
    .replace(/^\.+/, "")
    .replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i, "x");

  for (const key of allScenarioNames) {
    if (scenarioTitles[key]) {
      chartDesc += `${key}: ${scenarioTitles[key]}\n`;
    }
  }

  chartDesc += `\n${chartName} (${unit})\n`;

  const csvConfig = mkConfig({
    columnHeaders: columnHeaders,
    decimalSeparator: ".",
    fieldSeparator: ",",
    filename: filename,
    quoteCharacter: '"',
    quoteStrings: true,
    showColumnHeaders: true,
    showTitle: true,
    title: `${chartDesc}`,
    useBom: true,
    useTextFile: false
  });

  const csv = generateCsv(csvConfig)(dataToFormat);

  download(csvConfig)(csv);
}

export default downloadTableData;
