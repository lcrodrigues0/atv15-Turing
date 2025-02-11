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

  const {isSpecialUserCtx, setIsSpecialUserCtx} = useContext(AuthContext)

  // const [signer, setSigner] = useState()
  
  const [codenameIssue, setCodenameIssue] = useState()
  const [qttTuringIssue, setQttTuringIssue] = useState(0) 

  const [isVotingOn, setIsVotingOn] = useState(true)

  const [codenameVote, setCodenameVote] = useState()
  const [qttTuringVote, setQttTuringVote] = useState()

  const [rank, setRank] = useState([[]])

  const [specialUsers, setSpecialUsers] = useState([])
  const [hasVoted, setHasVoted] = useState()

  const [isReady, setIsReady] = useState(false)
  const [isLoadingVoting, setIsLoadingVoting] = useState(false)
  const [isLoadingIssue, setIsLoadingIssue] = useState(false)
  const [isLoadingVote, setIsLoadingVote] = useState(false)
  const [isLoadingRank, setIsLoadingRank] = useState(false)

  function _getIsSpecialUser(){
    const storedSession = JSON.parse(sessionStorage.getItem('isSpecialUser'))
    
    if(storedSession){
      setIsSpecialUserCtx(storedSession)
    }
  }

  let signer = null
  async function _initializeContract(){
      let _signer = signer
      if (_signer == null){
        // const provider = new ethers.JsonRpcProvider(URL_HARDHAT)
        const provider = new ethers.BrowserProvider(window.ethereum)
        _signer = await provider.getSigner()
        // setSigner(_signer)
        signer = _signer
      }

      const contract = new ethers.Contract(tokenAddress, TokenArtifact.abi, _signer)

      return contract
  }

  async function _setEventListener(){
    const contract = await _initializeContract()

    contract.on("BalancesChanged", (userAddress, event) => {
      console.log("Alteração nos saldos")

      getRankInfo()

      if(userAddress == signer.address && !toast.isActive(4)){
        console.log("Transação registrada.")
        toast.success("Transação registrada com sucesso.", {duration: 1500, id: 4, position: "top-center"})
      }
    })

    contract.on("VotingOn", event => {
      setIsLoadingVoting(false)
      console.log("voting on")

      if(!toast.isActive('2')){
        console.log("event voting on")
        toast.info("Votação aberta.", {duration: 1500, id: '2', position: "top-center"})
      }
    })

    contract.on("VotingOff", event => {
      setIsLoadingVoting(false)
      console.log("voting off")

      if(!toast.isActive('2')){
        console.log("event voting off")
        toast.info("Votação fechada.", {duration: 1500, id: '2', position: "top-center"})
      }
    })
  }

  useEffect(() => {
    _getIsSpecialUser()
    getRankInfo()
    getUsersInfo()
    _setEventListener()
  }, [])

  async function issueToken(){
    if (!codenameIssue|| !qttTuringIssue){
      toast.error("Preencha todos os campos", {duration: 1500, position: "top-center"})
      return 
    }

    if(isNaN(qttTuringIssue)){
      toast.error("Entrada inválida", {duration: 1500, position: "top-center"})
      return 
    }

    setIsLoadingIssue(true)
    const contract = await _initializeContract()

    try {
      await contract.issueToken(codenameIssue, ethers.parseEther(qttTuringIssue))
      // await getRankInfo()  

      toast.info("Envio realizado. \nAguarde alguns segundos até que a transação seja registrada.", {duration: 1500, position: "top-center"})
    } catch {
      if(!rank.some(pair => pair.includes(codenameVote))){
        toast.error("Usuário não registrado.", {duration: 1500, position: "top-center"})

      }
    }

    setIsLoadingIssue(false)
    
  }

  async function vote(){
    if (!codenameVote || !qttTuringVote){
      toast.error("Preencha todos os campos", {duration: 1500, position: "top-center"})
      return 
    }

    if(isNaN(qttTuringVote)){
      toast.error("Entrada inválida", {duration: 1500, position: "top-center"})
      return 
    }

    const contract = await _initializeContract()
    try {
      setIsLoadingVote(true)
      
      await contract.vote(codenameVote, ethers.parseEther(qttTuringVote))
      // await getRankInfo() 

      toast.info("Voto enviado. \n\nAguarde alguns instantes até que a transação seja confirmada.", {duration: 1500, position: "top-center"})

      setIsLoadingVote(false)

    } catch {
      const hasVoted = await contract.ifHasVoted(signer.address, codenameVote)
      const voteAddress =  await contract.getUserAddress(codenameVote)

      setIsLoadingVote(false)

      if(!isVotingOn){
        toast.error("Votação fechada!", {duration: 1500, position: "top-center"})
        console.log("Votação fechada!")

      } else if(hasVoted) {
        toast.error("Você já votou nesse usuário.", {duration: 1500, position: "top-center"})

      } else if(signer.address == voteAddress){
        toast.error("Você não pode votar em si mesmo!", {duration: 1500, position: "top-center"})

      } else if(qttTuringVote > 2){
        toast.error("O máximo permitido são 2 Turings.", {duration: 1500, position: "top-center"})

      } else if(!rank.some(pair => pair.includes(codenameVote))){
        toast.error("Usuário não registrado.", {duration: 1500, position: "top-center"})

      }
    }
  }

  async function setVoting(){
    setIsLoadingVoting(true)
    const contract = await _initializeContract()
    
    isVotingOn ? await contract.votingOff() : await contract.votingOn()

    if(!isVotingOn){
      setIsVotingOn(true)
    } else {
      setIsVotingOn(false)
    }

    toast.info("Envio realizado. \nAguarde alguns segundos até que a transação seja registrada.", {duration: 1500, position: "top-center"})
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
    
    toast.success("Quadro atualizado", {duration: 1500, toastId: '1', position: "top-left"})
  }

  async function getUsersInfo() {
    // Get special users
    const contract = await _initializeContract()
    
    let su = await contract.getSpecialUsers()

    let vo = await contract.getIsVotingOn()

    setIsVotingOn(vo)
    setSpecialUsers(su)
    setIsReady(true)
  }

  return (
    <>
      <GridLoader color="white" loading={!isReady  }/>
      {isReady && (
        <div className='app0'>
          <Ranking rank={rank} isLoadingRank={isLoadingRank}/>

          <div>
            <h1>Votação Turing</h1>

            {isSpecialUserCtx && (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                <IssueToken setCodenameIssue={setCodenameIssue} setQttTuringIssue={setQttTuringIssue} issueToken={issueToken} isLoadingIssue={isLoadingIssue} />
                <SetVoting setVoting={setVoting} isVotingOn={isVotingOn} isLoadingVoting={isLoadingVoting}/>
              </div>
            )}

            <div className='app'>
              {!isSpecialUserCtx && (
                <Vote setCodenameVote={setCodenameVote} setQttTuringVote={setQttTuringVote} vote={vote} isLoadingVote={isLoadingVote}/>
              )}
            </div>
          </div>
        </div>)}
      
      <ToastContainer pauseOnFocusLoss={false}/>
    </>
  )
}

export default Home
