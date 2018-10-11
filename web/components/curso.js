import React from "react";
import Router from "next/router";

import {
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  CardHeader,
  Badge,
  CardFooter
} from "reactstrap";
import Styles from "../css/index.scss";

export default class extends React.Component {
  render() {
    const {
      name,
      title,
      curr_image,
      date,
      category,
      style,
      year,
      genre
    } = this.props._source;

    return (
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardSubtitle >{genre}</CardSubtitle>
        </CardHeader>
        
        <CardBody>
          <CardText>
            {title.map(a => (
              <span>
                {a}
                <br />
              </span>
            ))}
            {style
              ? style.map(a => (
                  <Badge href="#" color="light">
                    {a}
                  </Badge>
                ))
              : ""}
          </CardText>
        </CardBody>
        <CardFooter>{year}</CardFooter>
      </Card>
    );
  }
}
