import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';

import Error from './Error';
import ListaCategorias from './ListaCategorias';


const EditarArticulo = props => {

    const token = new URLSearchParams(props.history.location.search).get( 't' );

    const { history, articulo, setRecargarArticulos } = props;

    console.log( 'Artículo INDIVIDUAL:', articulo )
    
    // refs
    const tituloRef = useRef('');
    const textoIntroRef = useRef('');
    const contenidoRef = useRef('');
    const imagenRef = useRef('');

    // state
    const [ error, setError ] = useState( false );
    const [ tipoArticulo, setTipoArticulo ] = useState('');
    const [ categoria, setCategoria ] = useState('');
    const [ categorias, setCategorias ] = useState([]);


    const getTypeArticle = e => {
        setTipoArticulo( e.target.value );
    }

    const getCategory = e => {
        setCategoria( e.target.value );
    }

    const editarArticulo = async e => {
        e.preventDefault();

        // comprobamos si la categoría y/o el estado del artículo han cambiado, de lo contrario asignamos el mismo valor
        let catArticulo = ( categoria === '' ) ? articulo.categoria : categoria;
        let estadoArticulo = ( tipoArticulo === '' ) ? articulo.tipoArticulo : tipoArticulo;

        // realizamos las validaciones
        if( tituloRef.current.value === '' || textoIntroRef.current.value === '' || contenidoRef.current.value === '' || estadoArticulo === '' || catArticulo === '' || imagenRef.current.value === ''){
            setError( true );
            return;
        }

        setError( false );

        // obtenemos el resto de valores del formulario
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${ token }`
          };

        const datosArticulo = {
            titulo : tituloRef.current.value,
            texto_introduccion : textoIntroRef.current.value,
            contenido : contenidoRef.current.value,
            estado : estadoArticulo,
            categoria : catArticulo,
            imagen : imagenRef.current.value
        }

        console.log( 'DATOS ARTÍCULO:', datosArticulo )

        try{
            const resultado = await axios({
                                    method: 'put',
                                    url: `https://api.elmoribundogarci.com/articulos/${ articulo.id }`,
                                    data: datosArticulo,
                                    headers,
                                    transformResponse: [function (data) {
                                        return data;
                                      }],
                                    responseType: 'json'
                                });
            
            if( resultado.status === 200 ){
                Swal.fire(
                    'Artículo Editado',
                    'El artículo se editó correctamente',
                    'success'
                 );
                
                // redirigimos al usuario a productos
                setRecargarArticulos( true );
                history.push( '/usuario/articulos' );

            }

        } catch( error ){
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

    }

    useEffect(() => {
        // consultamos el API para obtener el listado de categorias
        const consultarCategoriasApi = async () => {
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
        }

        consultarCategoriasApi();


    }, [ ])

    return(
        <div className="col-md-8 mx-auto ">
            <h1>Editar Artículo</h1>

            { ( error ) ? <Error mensaje='Todos los campos son obligatorios' /> : null }  
            <form
                className="mt-5"
                onSubmit={ editarArticulo }
            >
                <div className="form-group">
                    <label>Título</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="titulo" 
                        placeholder="Establecer Título"
                        ref={ tituloRef }
                        defaultValue={ articulo.titulo }
                    />
                </div>
                <div className="form-group">
                    <label>Imagen</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="imagen" 
                        placeholder="Indicar URL de la imagen de cabecera"
                        ref={ imagenRef }
                        defaultValue={ articulo.imagen }
                    />
                </div>
                <div className="form-group">
                    <label>Introducción</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="introduccion" 
                        placeholder="Establecer texto introductorio"
                        ref={ textoIntroRef }
                        defaultValue={ articulo.texto_introduccion }
                    />
                </div>
                <div className="form-group">
                    <label>Contenido</label>
                    <textarea 
                        className="form-control" 
                        name="contenido" 
                        rows="10"
                        ref={ contenidoRef }
                        defaultValue={ articulo.contenido }
                    />
                </div>
                <div className="form-group">
                    <label>Categoría</label>
                    <select 
                        className="form-control form-control-lg"
                        onChange={ getCategory }
                    >
                        {
                            categorias.map(categoria => {
                                return (
                                    <ListaCategorias
                                        key={ categoria.id }
                                        categoria={ categoria }
                                    />
                                );
                            })
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
                            defaultChecked={ ( articulo.estado === 'borrador' ) }
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
                            defaultChecked={ ( articulo.estado === 'publicado' ) }
                        />
                        <label className="form-check-label">
                            Publicado
                        </label>
                    </div>
                </div>
                <input type="submit" className="font-weight-bold text-uppercase mt-5 btn btn-primary btn-block py-3 mb-3" value="Editar Artículo" />
            </form>
        </div>
        

    )
}

export default withRouter( EditarArticulo );