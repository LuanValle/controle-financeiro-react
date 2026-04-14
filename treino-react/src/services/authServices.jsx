//autenticador de usuários, login, logout, registro, etc.

import {auth} from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

//função para registrar um novo usuário
export const registrarUsuario = async (email, senha) => {
    return await createUserWithEmailAndPassword(auth, email, senha);
}

//função para fazer login
export const loginUsuario = async (email, senha) => {
    return await signInWithEmailAndPassword(auth, email, senha);
}

//função para fazer logout
export const logoutUsuario = async () => {
    return await signOut(auth);
}