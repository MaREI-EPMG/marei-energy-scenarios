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
  const topics = ["tim-scenario"];
  const org = "MaREI-EPMG";
  const ghPages = `https://${org}.github.io`;

  const [isReposLoading, repositories] = useFetch(
    `https://api.github.com/orgs/${org}/repos?per_page=100`,
    cache
  );

  const topicRepos = isReposLoading
    ? null
    : repositories.filter((repository) => {
        return (
          topics.some((topic) => repository.topics.includes(topic)) &&
          repository.has_pages
        );
      });

  const sections = [
    {
      title: "Recent studies",
      repos: null,
      style: "success"
    },
    {
      title: "Work in progress",
      repos: topicRepos,
      style: ""
    },
    {
      title: "Archive",
      repos: null,
      style: "primary"
    }
  ];

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
                <Accordion defaultActiveKey="0" flush className="w-100">
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
              />
            }
          />
        ))}
    </Routes>
  );
}

export default App;
