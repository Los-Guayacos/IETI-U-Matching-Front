import React, { useState } from "react"
import Rating from "react-rating";
import EmptyStar from "../../assets/star.png"
import FullStar from "../../assets/fullStar.png"
import { NavBar } from "../../components";
import "./FilterSelection.css"
import { useHistory } from "react-router-dom";

export default function FilterSelection() {

    const history = useHistory();
    const [filters, setFilters] = useState({
        age: 25,
        gender: "Todos",
        interests: false,
        college: "",
        program: "",
        rating: 5
    });

    const handleData = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    }

    const setRating = (value) => {
        setFilters({ ...filters, rating: value })
    }

    const handleCheckBox = (e) => {
        setFilters({ ...filters, interests: e });
        console.log(e);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push({
            pathname: "/",
            state: {
                filter: filters
            }
        })
    }

    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            <NavBar />
            <form onSubmit={(e) => handleSubmit(e)} className="d-block m-5 col-12 col-md-8 col-lg-8 mt-3 mx-auto p-3" style={{ backgroundColor: "brown", borderRadius: "10px" }}>
                <label className="mt-1 text-light text-center d-block">Edad máxima</label>
                <input
                    type="number"
                    name="age"
                    min={15}
                    max={99}
                    value={filters.age}
                    placeholder="99"
                    className="form-control w-50 mx-auto text-center"
                    onChange={(e) => handleData(e)}
                />

                <label className="mt-1 text-light text-center d-block">Filtar por Género</label>
                <select
                    onChange={(e) => handleData(e)}
                    defaultValue="Todos"
                    className="form-control w-50 mx-auto text-center"
                    name="gender"
                >
                    <option value="Hombre">Todos</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Otro">Otro</option>
                </select>

                <label className="mt-1 text-light text-center d-block">Universidad</label>
                <select
                    onChange={(e) => handleData(e)}
                    defaultValue="Escuela Colombiana de Ingeniería Julio Garavito"
                    className="form-control w-50 mx-auto text-center"

                    name="college"
                >
                    <option value="Escuela Colombiana de Ingeniería Julio Garavito">Escuela Colombiana de Ingeniería Julio Garavito</option>
                </select>

                <label className="mt-1 text-light text-center d-block">Programa Académico</label>
                <select
                    onChange={(e) => handleData(e)}
                    defaultValue="Todos"
                    className="form-control w-50 mx-auto"
                    name="program"
                >
                    <option value="Todos">Todas los programas</option>
                    <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                    <option value="Ingeniería Mecánica">Ingeniería Mecánica</option>
                    <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                    <option value="Ingeniería Biomédica">Ingeniería Biomédica</option>
                    <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                    <option value="Ingeniería Eléctrica">Ingeniería Eléctrica</option>
                    <option value="Economía">Economía</option>
                    <option value="Administración de empresas">Administración de empresas</option>
                    <option value="Matemáticas">Matemáticas</option>
                </select>

                <label className="mt-1 text-light text-center d-block">Calificación mínima</label>
                <div className="mx-auto d-flex">
                    <Rating
                        emptySymbol={<img src={EmptyStar} style={{ width: 25 }} />}
                        fullSymbol={<img src={FullStar} style={{ width: 25 }} />}
                        initialRating={filters.rating}
                        name="rating"
                        className="mx-auto center"
                        value={filters.rating}
                        onChange={(value) => setRating(value)}
                    />
                </div>

                <label className="mt-1 text-light text-center d-block">¿Deseas buscar intereses comunes?</label>
                <input
                    type="checkbox"
                    id="interests"
                    name="interests"
                    value="true"
                    className="form-control input"
                    onChange={(e) => handleCheckBox(!filters.interests)}
                >

                </input>

                <button
                    className="btn w-50 btn-dark btn-block d-block mt-5 mx-auto"
                    type="submit"
                >
                    Buscar
                </button>
            </form>
        </div>
    )
}