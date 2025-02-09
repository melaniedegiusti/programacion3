import React, { Component } from 'react'
import Card from '../Card/Card';
import "./movies.css"
import Topbar from '../Topbar/Topbar';

class Movies extends Component {
    constructor(){
        super()
        this.state = {
            peliculas: "",
            originales:"",
            vueltas: 1,
            peliculasFiltered: "",
            tarjetasEnFila: false,
            text: "horizontal",
        }
    }

    componentDidMount(){
        fetch('https://api.themoviedb.org/3/movie/popular?api_key=c40a745984e9eb09a7b68f074f0aa025&language=en-US&page='+ this.state.vueltas)
            .then( respuesta => respuesta.json() )
            .then(data => {
                    this.setState({
                    peliculas: data.results,
                    originales: data.results,
                })
            })
            .catch( err => console.log(err))
    }

    agregarPeliculas(){
        fetch("https://api.themoviedb.org/3/movie/popular?api_key=c40a745984e9eb09a7b68f074f0aa025&language=en-US&page="+ (this.state.vueltas + 1))
            .then(respuesta=> respuesta.json())
            .then((data)=> {
                this.setState({
                peliculas: this.state.peliculas.concat(data.results),
                agregadas: data.results,
                vueltas: this.state.vueltas + 1,
                })
            })
    }

    borrarTarjeta(id){
        const resto = this.state.peliculas.filter( pelicula => pelicula.id !== id);
        this.setState({
            peliculas: resto,
        })
    }

    reset(){
        this.setState({
            peliculas: this.state.originales,
        })
    }
    
    filtrarPeliculas(textoAFiltrar){
        let peliculasFiltradas = this.state.peliculas.filter(pelicula => pelicula.title.toLowerCase().includes(textoAFiltrar.toLowerCase()));
        this.setState({
            peliculasFiltered: peliculasFiltradas,
        })
    }

    cambiarFormato(){
        if(this.state.tarjetasEnFila == true){
            this.setState({
                tarjetasEnFila: false,
                text:"horizontal"
            })
        } else {
            this.setState({
                tarjetasEnFila: true,
                text:"Vertical"
            })
        }
    }

    
    render() {
        
        let contenido;

        if(this.state.peliculas === "") {
            contenido = <p> Cargando...</p>
        } else if(this.state.peliculasFiltered !== ""){
            contenido = 
            <div className="cards">
                {this.state.peliculasFiltered.map( (pelicula) => (
                    <Card 
                    key={pelicula.id} 
                    datosPelicula={pelicula} 
                    borrar={(peliculaBorrar)=>this.borrarTarjeta(peliculaBorrar)}
                    direccion={this.state.tarjetasEnFila}
                    />
                ))}
            </div>
        } else {
            contenido = 
            <div className="cards">
                {this.state.peliculas.map((pelicula) => (
                    <Card 
                    key={pelicula.id} 
                    datosPelicula={pelicula} 
                    borrar={(peliculaBorrar)=>this.borrarTarjeta(peliculaBorrar)}
                    direccion={this.state.tarjetasEnFila}
                    />
                ))}
            </div>
        }
        return (
            <>
            <div className="buscadorr">
                <Topbar filtrarPeliculas={(textoAFiltrar)=>this.filtrarPeliculas(textoAFiltrar)} cambiarFormato= {()=>this.cambiarFormato()}/>
            </div> 
            <h3 className="h3"> PELICULAS MÁS POPULARES</h3>
            {contenido}
            <button onClick={()=>this.agregarPeliculas()} className="masPeliculas">Más Peliculas</button>
            <button onClick={()=>this.reset()} className="reset">Reset</button>
            </>
        );
    }

}

export default Movies