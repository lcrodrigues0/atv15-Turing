export function SetVoting({setVoting, isVotingOn}){
    return(
        <div className='app'>
            <input type="checkbox" id='toggle' onClick={setVoting}/>
            <label htmlFor="toggle">{isVotingOn? "Votação aberta" : "Votação fechada"}</label>
        </div>
    )
}