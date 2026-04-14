function PainelReserva({
    reserva,
    setReserva,
    valorInputReserva,
    setValorInputReserva,
    guardarReserva,
    resgatarReserva,
    formatarDinheiro
}){

    return(

    <div className='painel-reserva-container'>
        <h3 style={{color: '#3b82f6'}}>
        Reserva de Emergência: {formatarDinheiro(reserva)}
        </h3>
        <input type="number"
        placeholder='Valor da reserva'
        className='campo-entrada'
        value={valorInputReserva}
        onChange={(evento)=> setValorInputReserva(evento.target.value)}
        />
        <button className='btn-adicionar' onClick={guardarReserva}>Guardar</button>
        <button className='btn-adicionar' onClick={resgatarReserva}>Resgatar</button>

    </div>

    )
}

export default PainelReserva;