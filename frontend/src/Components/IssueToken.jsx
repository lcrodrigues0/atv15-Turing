import { PuffLoader } from "react-spinners";

export function IssueToken({setCodenameIssue, setQttTuringIssue, issueToken, isLoadingIssue}) {
    return (
        <div className='app'>
            <input 
                type="text"
                placeholder="Nome" 
                onChange={e => setCodenameIssue(e.target.value)}
            />
            <input 
                type="text"
                placeholder="Quantidade de Turings" 
                onChange={e => setQttTuringIssue(e.target.value)}
            />

            {!isLoadingIssue && (
                <button 
                    onClick={issueToken}>
                        Enviar
                </button>
            )}
            <PuffLoader color="white" loading={isLoadingIssue  } size={40} />    

        </div>
    )
}
