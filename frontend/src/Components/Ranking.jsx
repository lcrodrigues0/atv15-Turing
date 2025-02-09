import { PuffLoader } from "react-spinners";

export function Ranking({rank, isLoadingRank}){
    return (
        <div className='ranking'>
          <h1 style={{margin: '25px'}}>Ranking de Votos</h1>
          {isLoadingRank ? (
            <PuffLoader color="black" loading={isLoadingRank} size={50} />
          ):(
            <ul>
              {rank.map((element, index) => (
                <li key={index}>
                    <span>{element[0]}</span>
                    <span>{element[1]}</span>
                </li>
              ))}
            </ul>
          )}
            
      </div>
    )
}