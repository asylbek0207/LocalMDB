import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Nav from "react-bootstrap/Nav";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "./styles.css";
import {IMovieItem} from "../../interface";
import MovieList from "../MovieList";
import Pagination from "react-bootstrap/Pagination";
import MovieDetails from "../MovieDetails";

const KEY = 'd8e2bf32';

const Main: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('potter');
    const [page, setPage] = useState<number>(0);
    const [list, setList] = useState<IMovieItem[]>([]);
    let timeout: NodeJS.Timeout | null = null;

    useEffect(() => {
        setLoading(true);
        setList([]);

        fetch(`http://www.omdbapi.com/?s=${query}&page=${page ? page : 1}&apikey=${KEY}`)
            .then(resp => resp)
            .then(resp => resp.json())
            .then(response => {
                if (response.Response === 'False') {
                    alert(response.Error);
                } else {
                    setList(response.Search);
                    if (page > 0) {
                        window.history.replaceState({page: page}, 'page', `/page=${page}`);
                    } else {
                        window.history.replaceState({}, 'home', `/`);
                    }
                }

                setLoading(false);
            })
            .catch(({message}) => {
                alert(message);
                setLoading(false);
            })
    }, [query, page]);

    console.log(window.location);

    return <React.Fragment>
        <Container>
            <div className="main">
                <Nav className="app-bar justify-content-center" activeKey="/home">
                    <Nav.Item>
                        <Nav.Link>
                            <h1><span>📼</span>Local<strong>MDB</strong></h1>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={() => {
                            if (page) {
                                setPage(0);
                            } else {
                                setPage(1);
                            }
                        }}>
                            {page ? "Home" : "Search movies"}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="search-field">
                        {!!page && <InputGroup className="mb-3">
                                <FormControl placeholder="Search" onChange={(event) => {
                                    event.persist();
                                    if (timeout) {
                                        clearTimeout(timeout);
                                    }

                                    timeout = setTimeout(() => {
                                        setQuery(event.target.value);
                                    }, 1000)
                                }}/>
                            </InputGroup>}
                    </Nav.Item>
                </Nav>
                {window.location.pathname === '/' && list.length > 0 && <div className="movie-slider">
                        <div>
                            <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                                <div className="carousel-inner">
                                    <div className="carousel-item active movie-item">
                                        <MovieDetails movie={list[0]}/>
                                    </div>
                                    {list.map((item, index) => {
                                        if (index > 0) {
                                            return <div className="carousel-item movie-item" key={index.toString()}>
                                                    <MovieDetails movie={item}/>
                                                </div>
                                        }
                                    })}
                                </div>

                            </div>
                            <a className="carousel-control-prev" href="#carouselExampleControls" role="button"
                               data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            </a>
                            <a className="carousel-control-next" href="#carouselExampleControls" role="button"
                               data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            </a>
                        </div>
                    </div>}
                <div>
                    <div>

                    </div>
                </div>
                {window.location.pathname !== '/' && (
                    loading ? <p className="text-center">Loading...</p> : <React.Fragment>
                            <div className="movie-list">
                                <MovieList list={list}/>
                            </div>
                            <Pagination className="justify-content-center">
                                <Pagination.Prev disabled={page === 1} onClick={() => {
                                    if (page !== 1) {
                                        setPage(page - 1);
                                    }
                                }}/>
                                {page > 2 && (
                                    <Pagination.Ellipsis/>
                                )}
                                {page > 1 && (
                                    <Pagination.Item onClick={() => {
                                        if (page !== 1) {
                                            setPage(page - 1);
                                        }
                                    }}>{page - 1}</Pagination.Item>
                                )}
                                <Pagination.Item active>{page}</Pagination.Item>
                                {list.length > 0 && (
                                    <React.Fragment>
                                        <Pagination.Item onClick={() => {
                                            setPage(page + 1);
                                        }}>{page + 1}</Pagination.Item>
                                        <Pagination.Ellipsis/>
                                    </React.Fragment>
                                )}
                                <Pagination.Next disabled={list.length === 0} onClick={() => {
                                    setPage(page + 1);
                                }}/>
                            </Pagination>
                        </React.Fragment>
                )}
            </div>
        </Container>
    </React.Fragment>
}

export default Main;