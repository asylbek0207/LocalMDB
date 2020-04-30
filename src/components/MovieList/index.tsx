import React from "react";
import MovieCard from "../MovieCard";
import {IMovieItem} from "../../interface";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

interface IMovieListProps {
    list: IMovieItem[]
}

const MovieList: React.FC<IMovieListProps> = ({list}) => {

    return (
        <Row className="justify-content-center">
            {list.map((item, index) => (
                <Col xs={12} md={6} lg={4} key={`${item.Title}${index}`}>
                    <MovieCard movie={item} movieIndex={index}/>
                </Col>
            ))}
            {list.length === 0 && (
                <p>No results</p>
            )}
        </Row>
    )
}

export default MovieList;