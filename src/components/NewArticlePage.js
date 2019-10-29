import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { withRouter/*, Redirect*/ } from 'react-router-dom';    

import Error from './Error';
import ListaCategorias from './ListaCategorias';


const NewArticlePage = ({ history, setRecargarArticulos, usuario, setUsuario, isAuthenticated, setIsAuthenticated }) => {


    //state
    const [ titulo, setTitulo ] = useState('');
    const [ textoIntro, setTextoIntro ] = useState('');
    const [ imagen, setImagen ] = useState('');
    const [ contenido, setContenido ] = useState('');
    const [ tipoArticulo, setTipoArticulo ] = useState('');
    const [ categoria, setCategoria ] = useState('');
    const [ categorias, setCategorias ] = useState([]);

    // const fechaPublicacion = Date.now();
    // const fechaFormateada = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format( fechaPublicacion );
    
    const [ error, setError ] = useState( false );

    const getTypeArticle = e => {
        setTipoArticulo( e.target.value );
    }

    const getCategory = e => {
        setCategoria( e.target.value );
    }

    const AgregarArticulo = async e => {
        e.preventDefault();

        if( titulo === '' || textoIntro === '' || tipoArticulo === '' || categoria === '' || categoria === 'Seleccione Categoría...' || contenido === ''){
            setError( true );
            return;
        }

        setError( false );

        // creamos el nuevo articulo
        try{
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Token ${ usuario.token /*|| JSON.parse( sessionStorage.getItem( 'WellDone' ) ).usrToken*/ }`
              };

            const data = {
                titulo,
                texto_introduccion: textoIntro,
                contenido,
                estado: tipoArticulo,
                categoria,
                imagen
            }

            const resultado = await axios({
                method: 'post',
                url: 'https://api.elmoribundogarci.com/articulos/',
                data,
                headers,
                transformResponse: [function (data) {
                    return data;
                  }],
                responseType: 'json'
            });

            if( resultado.status === 201 ){
                Swal.fire(
                    'Artículo Creado',
                    'El artículo se creó correctamente',
                    'success'
                 );

                 setRecargarArticulos( true );
            }

        } catch(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                var output = '';
                var readErrors = Object.keys(error.response.data);
                readErrors.forEach(function(givenError) {
                var items = Object.keys(error.response.data[givenError]);
                items.forEach(function(item) {
                        var value = error.response.data[givenError][item];
                        output += '<p>' + givenError+' : ' + value + '</p>';
                    });
                });

              } 
          
            Swal.fire({
                type: 'error',
                title: 'Error',
                html: output
            });

        }

        // redirigimos al usuario a artículos
        history.push( '/usuario/articulos' );

    }

    useEffect(() => {
        // consultamos el API para obtener el listado de categorias
        const consultarCategoriasApi = async () => {
            // let isSubscribed = true;

            const resultado = await axios({
                                    method: 'get', 
                                    url: 'https://api.elmoribundogarci.com/categorias/' 
                                });
 
            const categoriasFinal = [
                {
                    "nombre" : "Seleccione Categoría...",
                    "id" : 0
                },
                ...resultado.data.results
            ]

            setCategorias( categoriasFinal );

            // if (isSubscribed) {
            //     setCategorias( categoriasFinal );
            // }

            // return () => isSubscribed = false;
        }

        

        consultarCategoriasApi();

    }, [ isAuthenticated, setIsAuthenticated, setUsuario ]);

    // // Comprobamos si ya hay un sesión creada y no estoy autenticado porque me han refrescado el navegador
    // if (sessionStorage.getItem("WellDone") && isAuthenticated === false ) {
    //     setIsAuthenticated( true );
    //     const sessionData = JSON.parse( sessionStorage.getItem( 'WellDone' ) );

    //     setUsuario({
    //     username: sessionData.usrName,
    //     id: sessionData.usrId,
    //     token: sessionData.usrToken
    //     });
    // }

    // if( !isAuthenticated && !sessionStorage.getItem("WellDone") ){
    //     return <Redirect to='/' />
    // }

    return(
        <div className="col-md-8 mx-auto ">
            <h1 className="text-center">Nuevo Artículo</h1>
            {( error ) ? <Error mensaje='Todos los campos son obligatorios' /> : null}
            <form
                className="mt-5"
                onSubmit={ AgregarArticulo }
            >
                <div className="form-group">
                    <label>Título</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="titulo" 
                        placeholder="Establecer Título"
                        onChange={ e => setTitulo( e.target.value ) }
                    />
                </div>
                <div className="form-group">
                    <label>Imagen</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="imagen" 
                        placeholder="Indicar URL de la imagen de cabecera"
                        onChange={ e => setImagen( e.target.value ) }
                    />
                </div>
                <div className="form-group">
                    <label>Introducción</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="introduccion" 
                        placeholder="Establecer texto introductorio"
                        onChange={ e => setTextoIntro( e.target.value ) }
                    />
                </div>
                <div className="form-group">
                    <label>Contenido</label>
                    <textarea 
                        className="form-control" 
                        name="contenido" 
                        rows="10"
                        onChange={ e => setContenido( e.target.value ) }></textarea>
                </div>
                <div className="form-group">
                    <label>Categoría</label>
                    <select 
                        className="form-control form-control-lg"
                        onChange={ getCategory }
                    >
                        {
                            categorias.map(categoria => (
                                <ListaCategorias
                                    key={ categoria.id }
                                    categoria={ categoria }
                                />
                            ))
                        }
                    </select>
                
                </div>
                <legend className="text-center">Estado Artículo:</legend>
                <div className="text-center">
                    <div className="form-check form-check-inline">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            name="estado"
                            value="DRF"
                            onChange={ getTypeArticle }
                        />
                        <label className="form-check-label">
                            Borrador
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            name="estado"
                            value="PUB"
                            onChange={ getTypeArticle }
                        />
                        <label className="form-check-label">
                            Publicado
                        </label>
                    </div>
                </div>
                <input type="submit" className="font-weight-bold text-uppercase mt-5 btn btn-primary btn-block py-3 mb-3" value="Agregar Artículo" />
            </form>
        </div>
    )
}

export default withRouter( NewArticlePage );