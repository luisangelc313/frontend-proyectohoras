import { Routes, Route } from 'react-router-dom';

import { PathsUrl } from '../utils/Paths';
import ErrorScreen from "../components/errors/ErrorScreen";
import Home from "../components/home/Home";
import AppNavbar from "../components/navegacion/AppNavbar";
import {
  RegistrarUsuario,
  PerfilUsuario,
  UsuariosListado,
  //CambiarPwd
} from "../components/seguridad";
import { ListadoActividades } from "../components/catactividades";
import { ListadoClientes } from "../components/catclientes";
import { ListadoSoluciones } from "../components/catsoluciones";
import { ListadoPerfiles } from "../components/catperfiles";
import { TaskLog, Pivote } from "../components/registrotiempos";


const RouterApp = () => {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" index="true" element={<Home />} />
        <Route path={PathsUrl.PerfilUsuario} element={<PerfilUsuario />} />
        <Route path={PathsUrl.RegistrarUsuario} element={<RegistrarUsuario />} />
        <Route path="*" element={<ErrorScreen />} />

        <Route path={PathsUrl.ActividadListado} element={<ListadoActividades />} />
        <Route path={PathsUrl.ClienteListado} element={<ListadoClientes />} />
        <Route path={PathsUrl.SolucionListado} element={<ListadoSoluciones />} />
        <Route path={PathsUrl.PerfilListado} element={<ListadoPerfiles />} />

        <Route path={PathsUrl.UsuarioListado} element={<UsuariosListado />} />
        <Route path={PathsUrl.UsuarioCaptura} element={<RegistrarUsuario />} />
        <Route path={PathsUrl.UsuarioEditar} element={<RegistrarUsuario />} />
        {/* <Route path={PathsUrl.UsuarioCambiarPwd} element={<CambiarPwd />} /> */}

        <Route path={PathsUrl.RegistroTiempos} element={<TaskLog />} />
        <Route path={PathsUrl.RegistroPivote} element={<Pivote />} />
      </Routes>
    </>
  );
}

export default RouterApp;