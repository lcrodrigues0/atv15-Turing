export function Ranking(props){
    return (
        <div className='ranking'>
          <h1 style={{margin: '25px'}}>Ranking de Votos</h1>
          <ul>
            {props.rank.map((element, index) => (
              <li key={index}>
                  <span>{element[0]}</span>
                  <span>{element[1]}</span>
              </li>
            ))}
          </ul>
      </div>
    )
}