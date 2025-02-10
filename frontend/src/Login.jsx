import {ethers} from 'ethers'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { AuthContext } from './AuthContext'

import TokenArtifact from "../../artifacts/contracts/Turing.sol/Turing.json"
import { PuffLoader } from 'react-spinners'

function Login() {
    const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS
    const URL_HARDHAT = "http://127.0.0.1:8545/"

    const { isSpeciaUserCtx, setIsSpecialUserCtx } = useContext(AuthContext)

    const navigate = useNavigate()
    const [isConnected, setIsConnected] = useState(false)
    const [signer, setSigner] = useState()
    
    const [specialUsers, setSpecialUsers] = useState([])
    const [authorizedUsers, setAuthorizedUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    async function authenticateUser(){
        setIsLoading(true)

        if(window.ethereum == null){
            toast.error("Metamask não está instalado.", {position: "top-center"})
            
            console.log("Metamask is not installed")
        } 
        else {
            if (window.ethereum && window.ethereum.disconnect) {
                await window.ethereum.disconnect();
            }

            const provider = new ethers.JsonRpcProvider(URL_HARDHAT)
            // const provider = new ethers.BrowserProvider(window.ethereum)
            const _signer = await provider.getSigner()

            setSigner(_signer)
            const contract = new ethers.Contract(tokenAddress, TokenArtifact.abi, _signer)

            toast.success("Conectado ao Metamask com sucesso.", {position: "top-center"})

            await getInfos(contract)
            
            setIsConnected(true)
        }

        setIsLoading(false)
    }

    async function getInfos(contract){
        const su = await contract.getSpecialUsers()
        setSpecialUsers(su)

        const au = await contract.getAuthorizedUsers()
        setAuthorizedUsers(au)
    }

    function goToNextPage() {
        setIsSpecialUserCtx(specialUsers.includes(signer.address))

        if(specialUsers.includes(signer.address) || authorizedUsers.includes(signer.address)){
            navigate("/home")
        } else {
            console.log(signer.address)
            toast.error("Usuário não autorizado.", {position: "top-center"})
        }
    }

    return (
        <div className="app">
            <h1>Votação Turing</h1>
            <button onClick={authenticateUser}>Conectar-se ao Metamask</button>

            {isConnected && (
                <button 
                    style={{'backgroundColor': 'green'}}
                    onClick={goToNextPage}
                >
                    Ir para votação
                </button>
            )}

            <PuffLoader color="green" loading={isLoading  } size={40} />

            <ToastContainer />
        </div>
    )
}

export default Login