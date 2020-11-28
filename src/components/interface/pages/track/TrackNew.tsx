import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Tag } from "../../../../lib/data/Tag";
import { Api } from "../../../../services/utils/Api";
import { Component } from "../../../Component";
import { TagsPicker } from "../../kit/TagsPicker";

export interface TrackNewProps {}

interface TrackNewState {
  tags: Tag[];
  scalar: string;
  title: string;
  comment: string;
}

export class TrackNew extends Component<TrackNewProps, TrackNewState> {
  state: TrackNewState = {
    tags: [],
    scalar: "",
    title: "",
    comment: "",
  };

  onRender() {
    const hasTag = this.state.tags.length > 0;

    const hasScalar = !!this.state.scalar;
    const hasTitle = !!this.state.title;
    const hasComment = !!this.state.comment;
    const hasValue = hasScalar || hasTitle || hasComment;

    const isValidScalar = this.state.scalar
      ? !isNaN(parseFloat(this.state.scalar))
      : undefined;

    const isValid = isValidScalar !== false;

    const canSubmit = hasTag && hasValue && isValid;

    return (
      <Container>
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Tags</Form.Label>
                <TagsPicker
                  tags={this.state.tags}
                  onChange={this.onTagsChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Value</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type number here ..."
                  value={this.state.scalar}
                  onChange={this.onScalarChange}
                  isValid={isValidScalar === true}
                  isInvalid={isValidScalar === false}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type title here ..."
                  value={this.state.title}
                  onChange={this.onTitleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  rows={10}
                  value={this.state.comment}
                  placeholder="Type comment here ..."
                  onChange={this.onCommentChange}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={!canSubmit}
                onClick={this.onFormSubmit}
                onSubmit={this.onFormSubmit}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }

  private onTagsChange = (tags: Tag[]) => {
    this.setState({ tags: tags });
  };
  private onScalarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ scalar: event.target.value });
  };
  private onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: event.target.value });
  };
  private onCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ comment: event.target.value });
  };

  private onFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const tags = this.state.tags;
    const scalar = this.state.scalar
      ? parseFloat(this.state.scalar)
      : undefined;
    const title = this.state.title ? this.state.title : undefined;
    const comment = this.state.comment ? this.state.comment : undefined;
    await Api.valueUpload(tags, scalar, title, comment);
    this.setState({
      scalar: "",
      title: "",
      comment: "",
    });
  };
}
