import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import {IMovieItem} from "../../interface";
import "./styles.css"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const KEY = 'd8e2bf32';

interface IMovieCardProps {
    movie: IMovieItem,
    movieIndex: number
}

const MovieCard: React.FC<IMovieCardProps> = ({movie}) => {
    const [modalOpened, setModalOpened] = useState<boolean>(false);
    const [movieDetailed, setMovieDetailed] = useState<IMovieItem | null>(null);

    useEffect(() => {
        fetch(`http://www.omdbapi.com/?t=${movie.Title}&plot=full&apikey=${KEY}`)
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

    }, [modalOpened, movie.Title]);

    const openModal = () => {
        setModalOpened(true);
    }
    const closeModal = () => {
        setModalOpened(false);
    }

    return (
        <React.Fragment>
            <Card className="movie-card">
                <div>
                    <Card.Img className="movie-poster" variant="top"
                              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/250x350/?Text=Постер не найден'}/>
                </div>
                <Card.Body className="movie-body">
                    <Card.Title>{movie.Title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{movie.Year}</Card.Subtitle>
                    <Card.Text>
                        {movie.Plot}
                    </Card.Text>
                    <Button className="detail-btn" onClick={openModal}>Details</Button>
                </Card.Body>
            </Card>
            {movieDetailed && (
                <Modal show={modalOpened} className="movie-dialog">
                    <Modal.Header>
                        <Modal.Title>{movieDetailed.Title} ({movieDetailed.Year})</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card className="dialog-card">
                            <Row>
                                <Col xs={4}>
                                    <Card.Img className="movie-poster" variant="top" src={movieDetailed.Poster}/>
                                </Col>
                                <Col xs={8}>
                                    <Card.Body className="dialog-content">
                                        <Card.Subtitle
                                            className="mb-2 text-muted">Director: {movieDetailed.Director}</Card.Subtitle>
                                        <Card.Subtitle
                                            className="mb-2 text-muted">Actors: {movieDetailed.Actors}</Card.Subtitle>
                                        <Card.Subtitle
                                            className="mb-2 text-muted">{`${movieDetailed.Runtime} | ${movieDetailed.Genre} | ${movieDetailed.Rated} | ${movieDetailed.Language}`}</Card.Subtitle>
                                        <Card.Text className="movie-plot">
                                            {movieDetailed.Plot}
                                        </Card.Text>
                                        <Card.Text className="movie-rating">
                                            {movieDetailed && movieDetailed.Ratings.length > 0 && (
                                                <Row>
                                                    {movieDetailed && movieDetailed.Ratings.map((item, index) => (
                                                        <Col key={index.toString()}>
                                                            {item.Source}: {item.Value}
                                                        </Col>
                                                    ))}
                                                </Row>
                                            )}
                                        </Card.Text>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={closeModal} variant="secondary">Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </React.Fragment>
    )
}

export default MovieCard;