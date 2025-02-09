import { PuffLoader } from "react-spinners";

export function SetVoting({setVoting, isVotingOn, isLoadingVoting}){
    return(
        <div className='app'>
            {isLoadingVoting ? (
                <PuffLoader color="white" loading={isLoadingVoting  } size={30} />
            ):( 
                <input type="checkbox" id='toggle' defaultChecked={isVotingOn} onClick={setVoting}/>
            )}
            <label htmlFor="toggle">{isVotingOn? "Votação aberta" : "Votação fechada"}</label>
            
        </div>
    )
}