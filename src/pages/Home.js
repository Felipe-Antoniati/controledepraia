import React, { useState, useEffect } from "react";
import {Link, useHistory } from "react-router-dom";
import api from "../services/api";

import Logo from "../components/Logo";
import ModalRegister from "../components/ModalRegister";
import ButtonsActions from "../components/ButtonsActions";

import { 
  FaCog, FaMinusCircle, FaUmbrellaBeach, FaRegWindowClose 
} from "react-icons/fa";

import "../styles/home.css";

export default function Home() {
  const [records, setRecords] = useState([]);
  const [getTotal, setGetTotal] = useState([]);
  const [total, setTotal] = useState("");
  const [openModalTotal, setOpenModalTotal] = useState("");
  const [openModalRegister, setOpenModalRegister] = useState("");

  const history = useHistory();
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    api
      .get("profile", {
        headers: {
          Authorization: userId,
        },
      })
      .then(response => {
        setRecords(response.data);
      }).then(
        
      );
  }, [userId]);  

  useEffect(() => {
    api.get("beach-umbrellas", {
      headers: {
        Authorization: userId,
      }
    }).then((response) => {
      setGetTotal(
        response.data.totalBeachUmbrellas.pop().total
      );
    })
  }, [userId])
  
  function activeModalTotal() {
    setOpenModalTotal("active");
  }

  function activeModalRegister() {
    setOpenModalRegister("active")
  }

  function removeActiveModalRegister() {
    setOpenModalRegister("")
  }
  function removeActiveModalTotal() {
    setOpenModalTotal("");
  }

  async function handleDeleteRecord(id) {
    try {
      await api.delete(`access-records/${id}`, {
        headers: {
          Authorization: userId,
        },
      });
      setRecords(records.filter(record => record.id !== id));
    } catch (err) {
      alert("Erro ao remover registro, tente novamente.");
    }
  }

  async function handleTotal(e) {
    e.preventDefault();
    const addTotal = { 
      total
    };
    api.post("beach-umbrellas", addTotal, {
      headers: {
        Authorization: userId,
      }
    });
    window.location.reload();
  }

  function handleLogout() {
    localStorage.clear();
    history.push("/");
  }

  return (
    <div className="header-page">
    <div id="modal-total" className={openModalTotal}>
        <div className="modal">
          <div id="form">
          <div className="header-form">
            <FaRegWindowClose 
              size={26}
              className="close-total"
              onClick={removeActiveModalTotal}
            /> 
          </div>
            <h2>Adicione o Total de Guarda-sóis</h2>
            <form action="" onSubmit={handleTotal}>
              <div className="input-group">
                <label htmlFor="total" className="sr-only">
                  Guarda-sóis
                </label>
                <input
                  type="text"
                  id="total"
                  name="total"
                  placeholder="Total de Guarda-sóis"
                  value={total}
                  onChange={e => setTotal(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="btn-save add"
              >
                Adicionar
              </button>
            </form>
          </div>
        </div>
      </div>
      <ModalRegister state={openModalRegister}>
        <ButtonsActions 
          onClick={removeActiveModalRegister} 
          saveClose={removeActiveModalRegister}
        />
      </ModalRegister>
      <header className="header-home">
        <Link to="/" onClick={handleLogout}>
          <span>Sair</span>          
        </Link>
        <Logo />
        <p className="welcome">
          Seja bem vindo(a),
          {userName}
        </p>
      </header>
      <main className="container">
        <section id="balance">
          <h2 className="sr-only">Visão Geral</h2>
         
          <div className="card total">
            <div>
              <h3>
                <span>Guarda-sóis</span>
              </h3>
              <p className="totalUmbrellas">
                {getTotal}
              </p>
            </div>
              <FaCog 
                size={26} 
                className="add-content"
                onClick={activeModalTotal}
              />
          </div>

          <div className="card in-use">
            <div>
              <h3>
                <span>Em uso</span>
              </h3>
              <p className="umbrellasInUse">
                {records.length}
              </p>
            </div>
          </div>
          <div className="card free">
            <div>
              <h3>
                <span>Livres</span>
              </h3>
              <p className="freeUmbrellas">
                {getTotal - records.length}
              </p>
            </div>
          </div>
        </section>
        <button 
          type="button " 
          className="btn-record" 
          onClick={activeModalRegister}
        >
          <span>Registrar novo uso</span>
          <FaUmbrellaBeach 
            size={26} 
            className="icon-umbrella" 
          />
        </button>
        <section id="records">
          <h2 className="sr-only">
            Registros de uso
          </h2>
          <table id="data-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Apartamento</th>
                <th>Guarda Sol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td className={
                    record.description 
                    === "Proprietário" 
                    ? "property" 
                    : "locatary"
                  }>
                    {record.description}
                  </td>
                  <td className="apartmentNumber">
                    {record.apartment_number}
                  </td>
                  <td className="umbrellaNumber">
                    {record.beach_umbrella}
                  </td>
                  <td className="btn-remove">
                    <FaMinusCircle 
                      size={26} 
                      alt="Remover registro"                     
                      onClick={
                        () => handleDeleteRecord(record.id)
                      }  
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};
