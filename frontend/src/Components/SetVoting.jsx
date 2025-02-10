import { PuffLoader } from "react-spinners";
import '../App.css'

export function SetVoting({ setVoting, isVotingOn, isLoadingVoting }) {
  return (
    <div className='app'>
      {isLoadingVoting ? (
        <PuffLoader color="white" loading={isLoadingVoting} size={30} />
      ) : (
        <div className="toggle-container">
          <input
            type="checkbox"
            id="toggle"
            defaultChecked={isVotingOn}
            onClick={setVoting}
            className="toggle-checkbox"
          />
          <label htmlFor="toggle" className="toggle-label">
            {isVotingOn ? "Votação aberta" : "Votação fechada"}
          </label>
        </div>
      )}
    </div>
  )
}
