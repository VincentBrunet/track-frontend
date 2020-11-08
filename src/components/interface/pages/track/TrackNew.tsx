import React from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
} from "react-bootstrap";
import { Tag } from "../../../../lib/data/Tag";
import { Value } from "../../../../lib/data/Value";
import { Api } from "../../../../services/utils/Api";
import { Component } from "../../../Component";

export interface TrackNewProps {}

interface TrackNewState {
  inputTagValue: string;
  inputTagSearch: Tag[];
  inputTagChoices: string[];

  inputScalarValue: string;
  inputScalarValid?: boolean;

  inputTitleValue: string;

  inputCommentValue: string;

  tagList?: Tag[];
  valueList?: Value[];
}

export class TrackNew extends Component<TrackNewProps, TrackNewState> {
  state: TrackNewState = {
    inputTagValue: "",
    inputTagSearch: [],
    inputTagChoices: [],

    inputScalarValue: "",
    inputTitleValue: "",
    inputCommentValue: "",
  };

  async onCreate() {
    this.setState({
      tagList: await Api.getTagList(),
    });
    this.setState({
      valueList: await Api.getValueList(),
    });
  }
  onDestroy() {}
  onUpdateState() {}

  onRender() {
    const hasValue =
      this.state.inputCommentValue ||
      this.state.inputTitleValue ||
      this.state.inputScalarValue;

    const hasTag = this.state.inputTagChoices.length > 0;

    const isValid = this.state.inputScalarValid !== false;

    const canSubmit = hasTag && hasValue && isValid;

    return (
      <Container>
        <Form>
          <Row>
            <Col xs={12} sm={12} md={4} className="alert-dark">
              <Form.Group>
                <Form.Label>Tags</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle
                    as={Form.Control}
                    type="text"
                    placeholder="Type to find tags"
                    onChange={this.inputTagOnChange}
                    value={this.state.inputTagValue}
                  />
                  {this.state.inputTagValue ? (
                    <Dropdown.Menu>
                      {this.state.tagList?.map((tag) => {
                        return (
                          <Dropdown.Item
                            key={tag.code}
                            onClick={() => {
                              this.inputTagExistingOnClick(tag);
                            }}
                          >
                            {tag.name}
                          </Dropdown.Item>
                        );
                      })}
                      <Dropdown.Item onClick={this.inputTagCreateOnClick}>
                        Create new tag "{this.state.inputTagValue}"
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  ) : undefined}
                </Dropdown>

                {this.state.inputTagChoices?.map((tag) => {
                  return (
                    <Badge
                      pill
                      variant="primary"
                      key={tag}
                      onClick={() => {
                        this.inputTagRemoveOnClick(tag);
                      }}
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>Value</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type number here ..."
                  value={this.state.inputScalarValue}
                  onChange={this.inputScalarOnChange}
                  isValid={this.state.inputScalarValid === true}
                  isInvalid={this.state.inputScalarValid === false}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type title here ..."
                  value={this.state.inputTitleValue}
                  onChange={this.inputTitleOnChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  rows={10}
                  value={this.state.inputCommentValue}
                  placeholder="Type comment here ..."
                  onChange={this.inputCommentOnChange}
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

        {this.state.valueList?.map((value) => {
          return (
            <Row key={value.id}>
              <Card>{JSON.stringify(value)}</Card>
            </Row>
          );
        })}
      </Container>
    );
  }

  private inputTagOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputTagValue: event.target.value });
  };
  private inputTagExistingOnClick = (tag: Tag) => {
    this.setState({
      inputTagChoices: [tag.code, ...this.state.inputTagChoices],
      inputTagValue: "",
    });
  };
  private inputTagCreateOnClick = () => {
    this.setState({
      inputTagChoices: [
        this.state.inputTagValue,
        ...this.state.inputTagChoices,
      ],
      inputTagValue: "",
    });
  };
  private inputTagRemoveOnClick = (choice: string) => {
    const inputTagChoices = [...this.state.inputTagChoices];
    inputTagChoices.splice(inputTagChoices.indexOf(choice), 1);
    console.log("inputTagChoices", inputTagChoices);
    this.setState({ inputTagChoices: inputTagChoices });
  };

  private inputScalarOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    this.setState({
      inputScalarValue: value,
      inputScalarValid: value ? !isNaN(parseFloat(value)) : undefined,
    });
  };
  private inputTitleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputTitleValue: event.target.value });
  };

  private inputCommentOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({ inputCommentValue: event.target.value });
  };

  private onFormSubmit = async () => {
    const data = {
      tags: this.state.inputTagChoices,
      scalar: this.state.inputScalarValue
        ? parseFloat(this.state.inputScalarValue)
        : undefined,
      title: this.state.inputTitleValue
        ? this.state.inputTitleValue
        : undefined,
      comment: this.state.inputCommentValue
        ? this.state.inputCommentValue
        : undefined,
    };
    const result = await Api.uploadValue(data);
    this.setState({
      inputScalarValue: "",
      inputTitleValue: "",
      inputCommentValue: "",
    });
    console.log("submit result", data, result);
    this.setState({
      valueList: await Api.getValueList(),
    });
  };
}
