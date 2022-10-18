import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useHttp } from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    heroesFetching, heroesFetched, heroesFetchingError,
    heroesDeleting, heroesDeleted, heroesDeletingError
} from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const { heroes, heroesLoadingStatus, activeFilter } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, []);

    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const deleteChar = (id) => {
        dispatch(heroesDeleting());
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(() => {
                dispatch(heroesFetching());
                request("http://localhost:3001/heroes")
                    .then(data => dispatch(heroesFetched(data)))
                    .catch(() => dispatch(heroesFetchingError()))
            })
            .then(() => dispatch(heroesDeleted()))
            .catch(() => dispatch(heroesDeletingError()))
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.filter(({ element }) => {
            return activeFilter === "all" ? true
                : element === activeFilter;
        }).map(({ id, ...props }) => {
            return (
                <CSSTransition
                    key={id}
                    timeout={500}
                    classNames="item"
                >
                    <HeroesListItem deleteHero={() => deleteChar(id)} {...props} />
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(heroes);
    return (
        <ul>
            <TransitionGroup>
                {elements}
            </TransitionGroup>
        </ul>
    )
}

export default HeroesList;