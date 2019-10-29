import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

// components
import Header from './components/Header';
import HomePage from './components/HomePage';
import SignUp from './components/SignUp';
import ArticleDetailPage from './components/ArticleDetailPage';
import UserDetailPage from './components/UserDetailPage';
import UserUpdate from './components/UserUpdate';
import CategoriesPage from './components/CategoriesPage';
import NewArticlePage from './components/NewArticlePage';
import EditarArticulo from './components/EditarArticulo';
import Articulos from './components/Articulos';
import Page404 from './components/Page404';

function Welldone() {

  //state
  const [ usuario, setUsuario ] = useState({});
  const [ articulos, setArticulos ] = useState([]);
  const [ recargarArticulos, setRecargarArticulos ] = useState( true );
  const [ isAuthenticated, setIsAuthenticated ] = useState( false );

  // console.log('IsAuthenticated', sessionStorage.getItem('welldoneIsAuthenticated'));
  // if( sessionStorage.getItem('welldoneIsAuthenticated') === null ){
  //   let varBool = false;
  // } else {
  //   console.log( 'El null NO es nulo' )
  // }

  useEffect(() => {
    if( recargarArticulos ){
      const consultarApi = async () => {
        // realizamos la consulta al API
        const resultadoArticulos = await axios({ 
                                            method: 'get',
                                            url: 'https://api.elmoribundogarci.com/articulos/?page=1' 
                                          });

        setArticulos( resultadoArticulos.data.results );
      }

      consultarApi();

      // cambiamos a false la recarga de articulos para que no este recargando continuamente
      setRecargarArticulos( false );

      // // Comprobamos si ya hay un sesión creada y no estoy autenticado porque me han refrescado el navegador
      // if (sessionStorage.getItem("WellDone") && isAuthenticated === false ) {
      //   setIsAuthenticated( true );
      //   const sessionData = JSON.parse( sessionStorage.getItem( 'WellDone' ) );

      //   setUsuario({
      //     username: sessionData.usrName,
      //     id: sessionData.usrId,
      //     token: sessionData.usrToken
      //   });
      // } 

    }
  }, [ recargarArticulos, isAuthenticated ]);

  return (
    <Router>
      <Header 
        isAuthenticated={ isAuthenticated }
        setIsAuthenticated={ setIsAuthenticated }
        usuario={ usuario }
        setUsuario={ setUsuario }
      />
      <main className="container mt-5">
        <Switch>
          <Route exact path="/usuario/nuevo" 
                render={ () => (
                  <SignUp 
                    isAuthenticated={ isAuthenticated }
                  />
                ) } 
          />
          <Route exact path="/usuario/articulos" 
                render={ () => (
                  <Articulos
                    usuario={ usuario }
                    setUsuario={ setUsuario }
                    isAuthenticated={ isAuthenticated }
                    setIsAuthenticated={ setIsAuthenticated }
                    setRecargarArticulos={ setRecargarArticulos }
                  />
                ) } 
          />
          <Route exact path="/categorias" component={ CategoriesPage } />
          <Route exact path="/articulos/nuevo" 
                 render={() => (
                   <NewArticlePage
                    usuario={ usuario }
                    setUsuario={ setUsuario }
                    isAuthenticated={ isAuthenticated }
                    setIsAuthenticated={ setIsAuthenticated }
                    setRecargarArticulos={ setRecargarArticulos }
                   />
                 )

                 } 
          />
          <Route exact path="/articulos/:id" component={ ArticleDetailPage } />
          <Route exact path="/articulos/editar/:id"
            render={ props => {
              // obtenemos el id del artículo
              const id = parseInt( props.match.params.id );
              
              const articulo = articulos.filter( articulo => articulo.id === id )[0];

              return(
                <EditarArticulo
                  articulo={ articulo }
                  setRecargarArticulos={ setRecargarArticulos }
                />
              );
            }
            }
          />
          <Route exact path="/usuarios/:id" component={ UserDetailPage } />
          <Route exact path="/usuarios/editar/:id" component={ UserUpdate } />
          <Route exact path="/"
                 render={ () =>  (
                   <HomePage
                    articulos={ articulos }
                    setRecargarArticulos={ setRecargarArticulos }
                   />
                 ) }  />
          <Route component={ Page404 } />
        </Switch>
      </main>
    </Router>
  );
}

export default Welldone;
