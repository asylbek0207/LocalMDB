import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import {IMovieItem} from "../../interface";
import "./styles.css"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const KEY = 'd8e2bf32';

interface IMovieCardProps {
    movie: IMovieItem,
}

const MovieDetails: React.FC<IMovieCardProps> = ({movie}) => {
    const [movieDetailed, setMovieDetailed] = useState<IMovieItem | null>(null);

    useEffect(() => {
        fetch(`http://www.omdbapi.com/?t=${movie.Title}&apikey=${KEY}`)
            .then(resp => resp)
            .then(resp => resp.json())
            .then(response => {
                if (response.Response === 'True') {
                    setMovieDetailed(response);
                }

            })
            .catch(({message}) => {
                alert(message);
            })

    }, [movie.Title]);

    return (
        <React.Fragment>
            {movieDetailed && (
                <Card className="slider-card">
                    <Row>
                        <Col xs={12} md={4} lg={4}>
                            <Card.Img className="movie-poster" variant="top" src={movieDetailed.Poster}/>
                        </Col>
                        <Col xs={12} md={8} lg={8}>
                            <Card.Body className="slider-content">
                                <Card.Subtitle
                                    className="mb-2 text-muted">Director: {movieDetailed.Director}</Card.Subtitle>
                                <Card.Subtitle
                                    className="mb-2 text-muted">Actors: {movieDetailed.Actors}</Card.Subtitle>
                                <Card.Subtitle
                                    className="mb-2 text-muted">{`${movieDetailed.Runtime} | ${movieDetailed.Genre} | ${movieDetailed.Rated} | ${movieDetailed.Language}`}</Card.Subtitle>
                                <Card.Text className="movie-plot">
                                    {movieDetailed.Plot}
                                </Card.Text>
                                <div className="movie-rating">
                                    {movieDetailed && movieDetailed.Ratings.length > 0 && (
                                        <Row>
                                            {movieDetailed && movieDetailed.Ratings.map((item, index) => (
                                                <Col key={index.toString()}>
                                                    <p>{item.Source}: {item.Value}</p>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </div>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            )}
        </React.Fragment>
    )
}

export default MovieDetails;