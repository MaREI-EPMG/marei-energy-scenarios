import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

function RepoCardsSection(props) {
  const { repositories, cardBg } = props;

  return (
    <>
      {repositories && (
        <Row
          xs={"auto"}
          className="py-2 justify-content-center align-items-center"
        >
          {repositories.map((repository, idx) => (
            <Col className="p-2" key={idx}>
              <Button variant="light" href={`/${repository.name}`}>
                <Card bg={cardBg}>
                  <Card.Header>{repository.name}</Card.Header>
                  <Card.Body>{repository.description}</Card.Body>
                </Card>
              </Button>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}

export default RepoCardsSection;
