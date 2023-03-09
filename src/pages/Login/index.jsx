import '../../assets/index.scss';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/UserContext'

function Login(props) {
  const [location, setLocation] = useState('')
  const [destination, setDestination] = useState('')
  const [name, setName] = useState('')
  const [disabled, setDisabled] = useState(false)
  const navigate = useNavigate()
  const { putUserData } = useUser()

useEffect(()=>{
if(localStorage.getItem('myUser')){
  navigate('/pages/roteiros')
}

},[])
  function CreadtedTravel() {
    if (name.length <= 0 && destination.length <= 0 && location.length <= 0) {
      props.notify('Prencha os dados')
    } else if (location.length <= 0) {
      props.notify('Prencha o campo de local')
    } else if (destination.length <= 0) {
      props.notify('Prencha o campo de destino')
    } else if (name.length <= 0) {
      props.notify('Prencha o campo de nome')
    } else {
      setDisabled(false)
      let myUser = JSON.parse(localStorage.getItem("myUser")) || {};
      myUser.dados = myUser.dados || [];
      myUser.dados.push({
        name: name,
        location: location,
        destination: destination
      });
      putUserData(myUser)
      props.successNotify('Seja Bem vindo!')
      navigate('/pages/roteiros')
    }
  }

  return (
    <motion.div
      className="page-content"
      id='page-content'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className='login' >
        <div className='login-content'>
          <div>
            <div className='travel-icon'></div>
          </div>
          <h2>Olá, espero te ajudar nessa incrivel viagem!</h2>
          <p>Seu nome?</p>
          <input className='input' onChange={(e) => setName(e.target.value)} />
          <p>Local atual?</p>
          <input className='input' onChange={(e) => setLocation(e.target.value)} />
          <p>Qual é o seu destino?</p>
          <input className='input' onChange={(e) => setDestination(e.target.value)} />
          <button className='button' onClick={() => CreadtedTravel()} disabled={disabled ? true : false}>Proximo</button>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
