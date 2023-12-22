// contains EPMG customisation
import "./App.css";
import "./energy-charts/index.css";
import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { Accordion, Container } from "react-bootstrap";
import useFetch from "./energy-charts/hooks/useFetch";
import { Portal, RepoCardsSection } from "./components";
import logo from "./logo.svg";

function App() {
  const cache = useRef({});
  const org = "MaREI-EPMG";
  const ghPages = `https://${org}.github.io`;
  const primaryTopic = "tim-scenario";

  const sections = [
    {
      repos: [],
      style: "success",
      title: "Recent studies",
      topic: "recent"
    },
    {
      repos: [],
      style: "",
      title: "Work in progress",
      topic: "WIP"
    },
    {
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
        todo = false;
      }
    }
    if (todo) {
      sections[defaultSection].repos.push(repository);
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
                  href="https://www.marei.ie/energy-policy-modelling/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                  <p>Energy Policy and Modelling Group (EPMG)</p>
                </a>
                <Accordion flush className="w-100">
                  {sections.map((section, idx) => (
                    <Accordion.Item
                      key={idx}
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
              />
            }
          />
        ))}
    </Routes>
  );
}

export default App;
