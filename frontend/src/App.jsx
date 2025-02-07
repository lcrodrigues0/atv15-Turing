import { useEffect, useState } from 'react'
import { ethers } from "ethers"

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TokenArtifact from "../../artifacts/contracts/Turing.sol/Turing.json"
import './App.css'


function App() {
  const conversionFactor = 10**18
  const URL_HARDHAT = "http://127.0.0.1:8545/"
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const [userName, setUserName] = useState()
  const [qttTuringIssue, setQttTuringIssue] = useState(0) 

  const [userBalance, setUserBalance] = useState()
  const [userBalanceAddr, setUserBalanceAddr] = useState()

  const [isVotingOn, setIsVotingOn] = useState(true)

  const [codenameVote, setCodenameVote] = useState()
  const [qttTuringVote, setQttTuringVote] = useState()

  const [rank, setRank] = useState([[]])

  const provider = new ethers.JsonRpcProvider(URL_HARDHAT)

  async function _initializeContract(){
    const signer = await provider.getSigner()
    const contract = await new ethers.Contract(tokenAddress, TokenArtifact.abi, signer)

    return contract
  }

  async function _setEventListener(){
    const contract = await _initializeContract()

    contract.on("Vote", event => {
      console.log("Votou!!")
      getInfo()
    })
  }

  useEffect(() => {
    _setEventListener()
    getInfo()
  }, [])
  
  async function issueToken(){
    const contract = await _initializeContract()
    await contract.issueToken(userName, ethers.parseEther(qttTuringIssue))
  }

  async function getBalance(){
    const contract = await _initializeContract()
    const balance = await contract.balanceOf(userBalanceAddr)

    setUserBalance(parseInt(ethers.formatEther(balance)))
  }

  async function setVoting(){
    const contract = await _initializeContract()
    
    isVotingOn ? await contract.votingOff() : await contract.votingOn()
    setIsVotingOn(prevState => !prevState)
  }

  async function vote(){
    try {
      const contract = await _initializeContract()
      await contract.vote(codenameVote, ethers.parseEther(qttTuringVote.toString()))

    } catch {
      if(!isVotingOn){
        console.log("Votação fechada!")
      }
    }
  }

  async function getInfo() {
    const contract = await _initializeContract()
    let [names, balances] = await contract.getUserInfos()

    balances = balances.map(balance => {
      return ethers.formatEther(balance)
    })
     
    let pairs = []
    names.forEach((name, index)=> {
      pairs[index] = [name, balances[index]]
    })

    pairs.sort((a, b) => b[1] - a[1])

    setRank(pairs)
  }
  
  return (
    <div className='app0'>
      <div className='ranking'>
          <h1 className='titleVotes'>Ranking de Votos</h1>
          <ul>
            {rank.map((element, index) => (
              <li key={index}>
                  <span>{element[0]}</span>
                  <span>{element[1]}</span>
              </li>
            ))}
          </ul>
      </div>

      <div>
        <h1>Votação Turing</h1>
        <div style={{display: 'flex', gap: '20px'}}>
          {/* Issue Token */}
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
            <button 
              onClick={issueToken}>
                Enviar
            </button>
          </div>

          {/* Get balance */}
          {/* <div className='app'>
            <input 
              type="text"
              placeholder="Endereço" 
              onChange={e => setUserBalanceAddr(e.target.value)}
            />
            <button 
              onClick={getBalance}>
                Obter Saldo
            </button>
            <p>{userBalance}</p>
          </div> */}

          {/* Voting On/Off */}
          <div className='app'>
              <input type="checkbox" id='toggle' onClick={setVoting}/>
              <label htmlFor="toggle">{isVotingOn? "Votação aberta" : "Votação fechada"}</label>
          </div>
          
          {/* Vote */}
          <div className='app'>
              <input 
                type='text'
                placeholder='Codinome'
                onChange={e => setCodenameVote(e.target.value)}  
              />
              <input 
                type='text' 
                placeholder='Quantidade de Turings'
                onChange={e => setQttTuringVote(parseInt(e.target.value))}
              />
              <button onClick={vote}>
                Votar
              </button>
          </div>
        </div>
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
    </div>

  )
}

export default App
