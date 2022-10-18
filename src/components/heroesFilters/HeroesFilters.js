import classNames from "classnames";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { activeFilterSet, filtersFetching, filtersFetched, filtersFetchingError } from '../../actions';
import { useHttp } from "../../hooks/http.hook";

import Spinner from "../spinner/Spinner";

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const { activeFilter, filters, filtersLoadingStatus } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))

        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner />;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const setActiveFilter = (filterName) => {
        dispatch(activeFilterSet(filterName));
    }

    const renderFiltersList = (arr) => {
        if (arr.length === 0) {
            return null;
        }

        return arr.map(({ id, name, rus, btnClass }) => {
            const classes = classNames({
                'btn': true,
                [btnClass]: true,
                'active': name == activeFilter
            });
            return (
                <button
                    key={id}
                    className={classes}
                    onClick={() => setActiveFilter(name)}>
                    {rus}
                </button>
            );
        })
    }

    const elements = renderFiltersList(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;