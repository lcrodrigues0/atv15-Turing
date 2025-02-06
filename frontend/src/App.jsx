import { useState } from 'react'
import { ethers } from "ethers"

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TokenArtifact from "../../artifacts/contracts/Turing.sol/Turing.json"
import './App.css'


function App() {
  const URL_HARDHAT = "http://127.0.0.1:8545/"
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const [count, setCount] = useState(0)

  const [userAdress, setUserAddress] = useState()
  const [value, setValue] = useState(0) 

  // Connect to Hardhat
  const provider = new ethers.JsonRpcProvider(URL_HARDHAT)
  // Get write access as an account by getting the signer
  const signer = provider.getSigner()

  const contract = new ethers.Contract(tokenAddress, TokenArtifact.abi, signer)

  function issueToken(){
    console.log(userAdress)
    console.log(value)
  }

  return (
    <>
      <h1>Votação Turing</h1>
      <div className='app'>

        <input 
          type="text"
          placeholder="Endereço" 
          onChange={e => setUserAddress(e.target.value)}
        />

        <input 
          type="text"
          placeholder="Quantidade de Turings" 
          onChange={e => setValue(e.target.value)}
        />

        <button 
          onClick={issueToken}>
            Enviar
        </button>
      </div>

      {/* <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
