import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Link/*, Redirect*/ } from 'react-router-dom';

import ListaArticulosEdicion from './ListaArticulosEdicion';
import Error from './Error';

const Articulos = ({ usuario, setUsuario, setRecargarArticulos, isAuthenticated, setIsAuthenticated }) => {

    //state
    const [ articulos, setArticulos ] = useState([]);
    const [ recargarArticulosUsuario, setRecargarArticulosUsuario ] = useState( true );

    useEffect(() => {
        
        if( recargarArticulosUsuario && isAuthenticated ){
        const consultarApi = async () => {
            // realizamos la consulta al API
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Token ${ usuario.token /*|| JSON.parse( sessionStorage.getItem( 'WellDone' ) ).usrToken*/ }`
              };

            const resultadoArticulos = await axios({ 
                                                method: 'get',
                                                url: `https://api.elmoribundogarci.com/articulos/?usuario=${ usuario.id }`,
                                                headers
                                            });

            setArticulos( resultadoArticulos.data.results );

        }

        consultarApi();

        // cambiamos a false la recarga de articulos para que no este recargando continuamente
        setRecargarArticulosUsuario( false );
        }
    }, [ recargarArticulosUsuario, usuario.id, isAuthenticated, usuario.token ]);

    // // Comprobamos si ya hay un sesión creada y no estoy autenticado porque me han refrescado el navegador
    // if (sessionStorage.getItem("WellDone") && isAuthenticated === false ) {
    //     setIsAuthenticated( true );
    //     const sessionData = JSON.parse( sessionStorage.getItem( 'WellDone' ) );

    //     setUsuario({
    //       username: sessionData.usrName,
    //       id: sessionData.usrId,
    //       token: sessionData.usrToken
    //     });
    //   }

    // if( !isAuthenticated && !sessionStorage.getItem("WellDone") ){
    //     return <Redirect to='/' />
    // }

    return(
        <Fragment>
            <h1 className="text-center">Listado de Artículos</h1>
            { (articulos.length === 0 ) &&
                    <div className="text-center">
                        <Error 
                            mensaje='No tiene ningún artículo creado'
                        />
                        <Link to="/articulos/nuevo" className="navbar-brand">
                            <button className="btn btn-primary">Crear Nuevo Artículo</button>
                        </Link>
                    </div>

                    
                
            }
            <ul className="list-group mt-5">
                {articulos.map(articulo => (
                    <ListaArticulosEdicion
                        key={ articulo.id }
                        articulo={ articulo }
                        usuario={ usuario }
                        setRecargarArticulos={ setRecargarArticulos }
                        setRecargarArticulosUsuario={ setRecargarArticulosUsuario }
                    />
                ))}
            </ul>
        </Fragment>
    )
}

export default Articulos;