import { PuffLoader } from "react-spinners";

export function Vote({setCodenameVote, setQttTuringVote, vote, isLoading}){
    return (
        <div className='app'>
            <input 
                type='text'
                placeholder='Codinome'
                onChange={e => setCodenameVote(e.target.value)}  
            />
            <input 
                type='text' 
                placeholder='Quantidade de Turings'
                onChange={e => setQttTuringVote(e.target.value)}
            />
            
            { !isLoading &&
                <button onClick={vote}>
                    Votar
                </button>
            }
            <PuffLoader color="white" loading={isLoading  } size={40} />

        </div>
    )
}