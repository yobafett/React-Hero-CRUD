import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { useHttp } from "../../hooks/http.hook";
import {
    filtersFetching, filtersFetched, filtersFetchingError,
    heroesAdding, heroesAdded, heroesAddingError
} from "../../actions";

import Spinner from "../spinner/Spinner";

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const { filters, filtersLoadingStatus, heroes } = useSelector(state => state);

    const [newHeroName, setNewHeroName] = useState('');
    const [newHeroText, setNewHeroText] = useState('');
    const [newHeroElement, setNewHeroElement] = useState('');

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

    const formNameChangeHandle = (e) => {
        setNewHeroName(e.target.value);
    }

    const formTextChangeHandle = (e) => {
        setNewHeroText(e.target.value);
    }

    const formElementChangeHandle = (e) => {
        setNewHeroElement(e.target.value);
    }

    const addChar = (e) => {
        e.preventDefault();

        const body = {
            'id': uuidv4(),
            'name': newHeroName,
            'description': newHeroText,
            'element': newHeroElement
        };

        dispatch(heroesAdding());
        request(`http://localhost:3001/heroes`, 'POST', JSON.stringify(body))
            .then(() => dispatch(heroesAdded([...heroes, body])))
            .catch(() => dispatch(heroesAddingError()))
    }

    const renderFiltersList = (arr) => {
        if (arr.length === 0) {
            return null;
        }

        return arr.map(({ id, name, rus }) => {
            return <option key={id} value={name}>{rus}</option>
        })
    }

    const elements = renderFiltersList(filters);
    return (
        <form onSubmit={addChar} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    required
                    onChange={formNameChangeHandle}
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    value={newHeroName}
                    placeholder="Как меня зовут?" />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    onChange={formTextChangeHandle}
                    name="text"
                    className="form-control"
                    id="text"
                    value={newHeroText}
                    placeholder="Что я умею?"
                    style={{ "height": '130px' }} />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select
                    required
                    onChange={formElementChangeHandle}
                    className="form-select"
                    id="element"
                    value={newHeroElement}
                    name="element">
                    <option >Я владею элементом...</option>
                    {elements}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;