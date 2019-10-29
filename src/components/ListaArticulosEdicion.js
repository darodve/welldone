import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ListaArticulosEdicion = ({ articulo, setRecargarArticulos, setRecargarArticulosUsuario, usuario, history }) => {

    // const fechaFormateada = new Intl.DateTimeFormat('es-ES', {year:   'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format( articulo.fecha_creacion );
    const fecha = new Date(articulo.fecha_creacion);
    let day = fecha.getDate();
    let month = fecha.getMonth();
    let year = fecha.getFullYear();
    const dateFormatted = day + '-' + month + '-' + year;

    const eliminarArticulo = id => {
        
        Swal.fire({
            title: 'Estás seguro?',
            text: "No vas a poder volver a recuperar el artículo!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!'
          }).then(async (result) => {
            if (result.value) {

                try{
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${ usuario.token }`
                      };
    
                    const resultado = await axios({
                                            method: 'delete',
                                            url: `https://api.elmoribundogarci.com/articulos/${ id }`,
                                            headers,
                                            transformResponse: [function (data) {
                                                return data;
                                              }],
                                            responseType: 'json'
                                        });
                    if( resultado.status === 204 ){
                        Swal.fire(
                            'Borrado!',
                            'Tu artículo ha sido borrado.',
                            'success'
                        );
                        setRecargarArticulos( true );
                        setRecargarArticulosUsuario( true );

                        // redirigimos al usuario a artículos
                        history.push( '/usuario/articulos' );
                    }

                } catch( error ) {
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

                    setRecargarArticulos( false );
                    setRecargarArticulosUsuario( false );
                }
                
                
            }
          })
    }

    return(
        <>
        <li className="list-group-item d-flex justify-content-between align-items-center" data-categoria={ articulo.categoria }>
            <p>
                <span className="font-weight-bold">{ articulo.titulo }</span><br/><small>{ dateFormatted }</small>
            </p>
            <div>
                <Link
                    to={`/articulos/editar/${ articulo.id }?t=${ usuario.token }`}
                    className="btn btn-success mr-2"
                >Editar </Link>
                <a href={ '#art' + articulo.id } data-toggle="collapse" role="button" aria-expanded="false" aria-controls={ "art" + articulo.id } className="btn btn-success mr-2">Editar Artículo</a>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => eliminarArticulo( articulo.id )}
                >
                    Eliminar &times;
                </button>
            </div>
        </li>
        <div id={ "art" + articulo.id } className="collapse list-group-item justify-content-between align-items-center mb-2">
            Mi bloque
        </div>
        </>
    )
}

export default withRouter( ListaArticulosEdicion );