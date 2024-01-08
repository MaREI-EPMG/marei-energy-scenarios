// contains EPMG customisation
import "./App.css";
import "./energy-charts/index.css";
import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { Accordion, Container } from "react-bootstrap";
import useFetch from "./energy-charts/hooks/useFetch";
import { Portal, RepoCardsSection } from "./components";
import { useMatomoPageView } from "./hooks/useMatomoPageView";
import logo from "./logo.svg";

function App() {
  const cache = useRef({});
  const org = "MaREI-EPMG";
  const ghPages = `https://${org}.github.io`;
  const primaryTopic = "tim-scenario";

  const sections = [
    {
      alert: {
        heading: "Recent Studies",
        text: "Results are expected to be stable, but may be updated if circumstances require it.",
        variant: "info" //  'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
      },
      repos: [],
      style: "success",
      title: "Recent studies",
      topic: "recent"
    },
    {
      alert: {
        heading: "Work in progress",
        text: "Please don't cite or use these results.",
        variant: "danger"
      },
      repos: [],
      style: "",
      title: "Work in progress",
      topic: "WIP"
    },
    {
      alert: {
        heading: "An archived project",
        text: "This project is complete, and the results have been archived.",
        variant: "info"
      },
      repos: [],
      style: "primary",
      title: "Archive",
      topic: "archive"
    }
  ];

  const defaultSection = 1;

  function categoriseRepos(repository) {
    let todo = true;
    for (let section of sections) {
      if (repository.topics.includes(section.topic)) {
        section.repos.push(repository);
        repository.alert = section.alert;
        todo = false;
      }
    }
    if (todo) {
      sections[defaultSection].repos.push(repository);
      repository.alert = sections[defaultSection].alert;
    }
  }

  const [isReposLoading, repositories] = useFetch(
    `https://api.github.com/orgs/${org}/repos?per_page=100`,
    cache
  );

  const topicRepos = isReposLoading
    ? null
    : repositories.filter((repository) =>
      repository.has_pages && repository.topics.includes(primaryTopic)
    );

  if (topicRepos) {
    topicRepos.forEach(categoriseRepos); 
  }
  const activeSections = ["0", "1", "2"];

  useMatomoPageView();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="App">
            <header className="App-header">
              <Container fluid="xxl">
                <a
                  className="App-link"
                  href="https://www.ucc.ie/energypolicy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" /> 
                  <p>
                    Energy Policy &amp; Modelling Group
                    of University College Cork
                    <br />Results from the TIMES Ireland Model
                  </p>
                </a>
                <Accordion alwaysOpen flush defaultActiveKey={activeSections} className="w-100">
                  {sections.map((section, idx) => (
                    <Accordion.Item
                      key={idx}
                      eventKey={`${idx}`}
                      style={{ backgroundColor: "transparent" }}
                    >
                      <Accordion.Header>{section.title}</Accordion.Header>
                      <Accordion.Body>
                        <RepoCardsSection
                          repositories={section.repos}
                          cardBg={section.style}
                        />
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Container>
            </header>
          </div>
        }
      />
      {topicRepos &&
        topicRepos.map((topicRepo, idx) => (
          <Route
            key={idx}
            path={`${topicRepo.name}/*`}
            element={
              <Portal
                source={`${ghPages}`}
                study={`${topicRepo.name}`}
                cache={cache}
                alert={topicRepo.alert}
              />
            }
          />
        ))}
    </Routes>
  );
}

export default App;
