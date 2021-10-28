import React, {Component} from 'react';
import '../Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Cookies from 'universal-cookie';

const baseUrl="http://localhost:3001/usuarios";
const cookies = new Cookies();
class Login extends Component {

    state={
        form:{
            userName: '',
            password: ''
        }
    }
    handleChange=async e=>{
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }
    iniciarSesion=async()=>{
        await axios.get(baseUrl, {params: {userName: this.state.form.username, password: this.state.form.password}})
        .then(response=>{
            return response.data;
        })
        .then(response=>{
            if(response.length>0){
                var respuesta=response[0];
                cookies.set('id', respuesta.id, {path: "/"});
                cookies.set('email', respuesta.email, {path: "/"});
                cookies.set('address', respuesta.address, {path: "/"});
                cookies.set('name', respuesta.name, {path: "/"});
                cookies.set('age', respuesta.age, {path: "/"});
                cookies.set('university', respuesta.university, {path: "/"});
                cookies.set('carreer', respuesta.carreer, {path: "/"});
                cookies.set('lastName', respuesta.lastName, {path: "/"});
                alert(`Bienvenido ${respuesta.name} ${respuesta.lastName}`);
                window.location.href="./menu";
            }else{
                alert('El usuario o la contraseña no son correctos');
            }
        })
        .catch(error=>{
            console.log(error);
        })

    }
    render(){
        return(
            <div className="containerPrincipal">
            <div className="containerSecundario">
              <div className="form-group">
                <label>Usuario: </label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  name="userName"
                  onChange={this.handleChange}
                />
                <br />
                <label>Contraseña: </label>
                <br />
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  onChange={this.handleChange}
                />
                <br />
                <button className="btn btn-primary" onClick={()=> this.iniciarSesion()} >Iniciar Sesión</button>
              </div>
            </div>
          </div>
        );
    }
}

export default Login;