import { PuffLoader } from "react-spinners";

export function IssueToken({setUserName, setQttTuringIssue, issueToken, isLoading}) {
    return (
        <div className='app'>
            <input 
                type="text"
                placeholder="Nome" 
                onChange={e => setUserName(e.target.value)}
            />
            <input 
                type="text"
                placeholder="Quantidade de Turings" 
                onChange={e => setQttTuringIssue(e.target.value)}
            />

            {!isLoading && (
                <button 
                    onClick={issueToken}>
                        Enviar
                </button>
            )}
            <PuffLoader color="white" loading={isLoading  } size={40} />    

        </div>
    )
}
