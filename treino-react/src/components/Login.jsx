//tela de login e registro de usuários

import React, { useState } from 'react';
import { registrarUsuario, loginUsuario } from '../services/authServices';



function Login(){
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState(''); 

    //handlelogin para fazer login do usuário
    async function handleLogin() {
        try {
            await loginUsuario(email, senha);
            alert('Login bem-sucedido!');
        }catch (error) {
            alert('Erro ao fazer login: ' + error.message);
        }
    }

    //handleregistro para registrar um novo usuário
    async function handleRegistro(){
        try {
            await registrarUsuario(email, senha);
            alert('Registro bem-sucedido! Agora você pode fazer login.');
        }catch (error) {
            alert('Erro ao registrar usuário: ' + error.message);
        }
    }

    return (
        <div style={{padding:'20px', textAlign:'center'}}>
            <h2>Login / Cadastro</h2>

            {/* Campo de email */}
            <input 
            type="email"
            placeholder='Seu email'
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            />

            {/* Campo de senha */}
            <input 
            type="password"
            placeholder='Sua senha'
            value={senha}
            onChange={(e) => setSenha(e.target.value)} 
            />

<br />
            {/* Botão de login */}
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegistro}>Registrar</button>
        </div>

    )

}

export default Login;