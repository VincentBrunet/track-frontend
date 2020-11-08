import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Component } from "../../Component";
import { Switcher } from "./Switcher";

export class Content extends Component {
  onRender() {
    return (
      <Container>
        <Row>
          <Col>
            <Switcher />
          </Col>
        </Row>
      </Container>
    );
  }
}
