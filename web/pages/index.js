import Link from "next/link";
import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Jumbotron,
  ListGroup,
  ListGroupItem,
  CardColumns,
  Badge
} from "reactstrap";
import Page from "../components/page";
import Layout from "../components/layout";
import cursos from "../cursos.json";
import Curso from "../components/curso";
import axios from "axios";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

const Range = Slider.Range;
export default class extends Page {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      styles: [],
      genres: [],
      genre: null,
      style: null,
      dates: { min: 1950, max: 2010 },
      date: {min: 1950, max: 2010}
    };
    this.search_input = React.createRef();
  }
  componentDidMount() {
    this.doSearch();
  }
  setStyle(style) {
    var este = this;
    this.setState({ style: (style == este.state.style?null:style)  });
    setTimeout(function() {
      this.doSearch();
    }, 200);
  }
  setGenre(genre) {
    var este = this;
    this.setState({ genre:  (genre == este.state.genre?null:genre) });
    setTimeout(function() {
      este.doSearch();
    }, 200);
  }
  doSearch = () => {
    const value = this.search_input.current.value;
    axios
      .post("/api/search", {
        term: value,
        style: this.state.style,
        genre: this.state.genre,
        dates: this.state.date
      })
      .then(data => {
        console.log(data);
        if(data.data.aggregations){
          this.setState({
            albums: data.data.hits.hits,
            styles: data.data.aggregations.styles
              ? data.data.aggregations.styles.buckets
              : [],
            genres: data.data.aggregations.genres
              ? data.data.aggregations.genres.buckets
              : []
          });
        } else {

        }
        this.setState({
          albums: data.data.hits.hits
         
        });
      });
  };
  onSliderChange = (date)  =>{
    this.setState({date:{min: date[0],max: date[1]}})
  }
  render() {
    const { albums, styles, genres, dates ,date} = this.state;
    console.log(dates);
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Jumbotron
          className="text-light rounded-0"
          style={{
            backgroundColor: "rgba(73,155,234,1)",
            background:
              "radial-gradient(ellipse at center, rgba(73,155,234,1) 0%, rgba(32,124,229,1) 100%)",
            boxShadow: "inset 0 0 100px rgba(0,0,0,0.1)"
          }}
        >
          <Container className="mt-2 mb-2">
            <h1 className="display-2 mb-3" style={{ fontWeight: 300 }}>
              <span style={{ fontWeight: 600 }}>
                <span className="mr-3">▲</span>
                <br className="v-block d-sm-none" />
                Discogz
              </span>
              <br className="v-block d-lg-none" /> Search
            </h1>
            <p className="lead mb-5">Un paso adelante.</p>

            <style jsx>{`
              .display-2 {
                text-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
                color: rgba(255, 255, 255, 0.9);
              }
              .lead {
                font-size: 3em;
                opacity: 0.7;
              }
              .search_input {
                border-radius: 20px;
                font-size: 1.3em;
                width: 100%;
              }
              @media (max-width: 767px) {
                .display-2 {
                  font-size: 3em;
                  margin-bottom: 1em;
                }
                .lead {
                  font-size: 1.5em;
                }
              }
            `}</style>
          </Container>
        </Jumbotron>
        <Container>
          <div className="col-md-12 col-md-offset-3">
            <input
              type="text"
              className="search_input"
              placeholder="Buscar ..."
              ref={this.search_input}
              onKeyUp={this.doSearch}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            {genres
              ? genres.map(a => (
                  <Badge
                    href="#"
                    color={a.key == this.state.genre ? "dark" : "light"}
                    onClick={this.setGenre.bind(this, a.key)}
                  >
                    {a.key} ({a.doc_count})
                  </Badge>
                ))
              : ""}
          </div>
          <div style={{ textAlign: "center" }}>
            {styles
              ? styles.map(a => (
                  <Badge
                    href="#"
                    color={a.key == this.state.style ? "dark" : "light"}
                    onClick={this.setStyle.bind(this, a.key)}
                  >
                    {a.key} ({a.doc_count})
                  </Badge>
                ))
              : ""}
          </div>
          <Row className="mt-5">
            <Col>
              <input value={date.min} className="float-right" />
            </Col>
            <Col>
              <Range
                defaultValue={[dates.min, dates.max]}
                min={dates.min}
                max={dates.max}
                onChange={this.onSliderChange}
              />
            </Col>
            <Col>
              <input value={date.max}  />
            </Col>
          </Row>
          <CardColumns className="mt-5">
            {albums.map(function(i) {
              return <Curso {...i} />;
            })}
          </CardColumns>
          <style jsx>{`
            .search_input {
              border-radius: 90px;
              font-size: 1.6em;
              text-align: center;
              width: 100%;
              border: solid 1px #333;
              padding: 5px 10px 8px 10px;
            }
          `}</style>
        </Container>
      </Layout>
    );
  }
}
