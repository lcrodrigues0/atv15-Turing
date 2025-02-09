import { useContext, useEffect, useState } from 'react'
import { ethers } from "ethers"

import TokenArtifact from "../../artifacts/contracts/Turing.sol/Turing.json"
import './App.css'
import { AuthContext } from './AuthContext'
import { Ranking } from './Components/Ranking'
import { IssueToken } from './Components/IssueToken'
import { SetVoting } from './Components/SetVoting'
import { Vote } from './Components/Vote'
import { toast, ToastContainer } from 'react-toastify'
import { GridLoader } from 'react-spinners'

function Home() {
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS
  const URL_HARDHAT = "http://127.0.0.1:8545/"

  const {isSpecialUserCtx = false, setIsSpecialUserCtx} = useContext(AuthContext)

  const [signer, setSigner] = useState()
  
  const [userName, setUserName] = useState()
  const [qttTuringIssue, setQttTuringIssue] = useState(0) 

  const [isVotingOn, setIsVotingOn] = useState(true)

  const [codenameVote, setCodenameVote] = useState()
  const [qttTuringVote, setQttTuringVote] = useState()

  const [rank, setRank] = useState([[]])

  const [specialUsers, setSpecialUsers] = useState([])
  const [hasVoted, setHasVoted] = useState()

  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function _initializeContract(){
      let _signer = signer
      if (_signer == null){
        const provider = new ethers.JsonRpcProvider(URL_HARDHAT)
        // const provider = new ethers.BrowserProvider(window.ethereum)
        _signer = await provider.getSigner()
        setSigner(_signer)
      }

      const contract = new ethers.Contract(tokenAddress, TokenArtifact.abi, _signer)

      return contract
  }

  async function _setEventListener(){
    const contract = await _initializeContract()

    contract.on("BalancesChanged", event => {
      console.log("Alteração nos saldos")
      getInfo()
    })
  }

  useEffect(() => {
    _setEventListener()
    getRankInfo()
    getUsersInfo()
  }, [])

  async function issueToken(){
    const contract = await _initializeContract()

    setIsLoading(true)
    await contract.issueToken(userName, ethers.parseEther(qttTuringIssue))

    await getRankInfo() 
    toast.success("Envio realizado com sucesso.", {position: "top-center"})
  }

  async function vote(){
    if (!codenameVote || !qttTuringVote){
      toast.error("Preencha todos os campos", {position: "top-center"})
      return 
    }

    const contract = await _initializeContract()
    try {
      setIsLoading(true)
    
      
      await contract.vote(codenameVote, ethers.parseEther(qttTuringVote))
      await getRankInfo() 

      toast.success("Voto registrado com sucesso.", {position: "top-center"})

    } catch {
      const hasVoted = await contract.ifHasVoted(signer.address, codenameVote)
      const voteAddress =  await contract.getUserAddress(codenameVote)

      setIsLoading(false)

      if(!isVotingOn){
        toast.error("Votação fechada!", {position: "top-center"})
        console.log("Votação fechada!")

      } else if(hasVoted) {
        toast.error("Você já votou nesse usuário.", {position: "top-center"})

      } else if(signer.address == voteAddress){
        toast.error("Você não pode votar em si mesmo!", {position: "top-center"})

      } else if(qttTuringVote > 2){
        toast.error("O máximo permitido são 2 Turings.", {position: "top-center"})

      } else if(!rank.some(pair => pair.includes(codenameVote))){
        toast.error("Usuário não registrado.", {position: "top-center"})

      }
    }
  }

  async function setVoting(){
    const contract = await _initializeContract()
    
    isVotingOn ? await contract.votingOff() : await contract.votingOn()

    if(!isVotingOn){
      toast.info("Votação aberta.", {position: "top-center"})
    } else {
      toast.info("Votação fechada.", {position: "top-center"})
    }

    setIsVotingOn(prevState => !prevState)
  }

  async function getRankInfo() {
    const contract = await _initializeContract()

    // Get user infos for ranking
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

    setIsLoading(false)
  }

  async function getUsersInfo() {
    // Get special users
    const contract = await _initializeContract()
    
    let su = await contract.getSpecialUsers()

    setSpecialUsers(su)
    setIsReady(true)
  }

  return (
    <>
      <GridLoader color="white" loading={!isReady  }/>
      {isReady && (
        <div className='app0'>
          <Ranking rank={ rank }/>

          <div>
            <h1>Votação Turing</h1>

            {isSpecialUserCtx && (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                <IssueToken setUserName={setUserName} setQttTuringIssue={setQttTuringIssue} issueToken={issueToken} isLoading={isLoading} />
                <SetVoting setVoting={setVoting} isVotingOn={isVotingOn}/>
              </div>
            )}

            <div className='app'>
              {!isSpecialUserCtx && (
                <Vote setCodenameVote={setCodenameVote} setQttTuringVote={setQttTuringVote} vote={vote} isLoading={isLoading}/>
              )}
            </div>
          </div>
        </div>)}
      
      <ToastContainer />
    </>
  )
}

export default Home
