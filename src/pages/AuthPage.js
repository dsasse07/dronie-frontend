import { IonContent, IonPage, IonSegment, IonSegmentButton, IonLabel} from '@ionic/react';
import { IonCard, IonCardContent } from '@ionic/react';
import SignupForm from '../components/SignupForm'
import LoginForm from '../components/LoginForm'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import dronieLogo from '../assets/dronieLogo.png'
import meshGradient from '../assets/meshGradient.png'
import SplashScreen from '../components/SplashScreen';

function AuthPage ({setChatSubscription}) {
  const [ showLogin, setShowLogin ] = useState(true)
  // const [ showLoadScreen, setShowLoadScreen ] = useState(true)

  function toggleFormDisplay(formToShow){
    setShowLogin( formToShow === "login")
  }

  // useEffect ( () => {
  //   const timer = setTimeout( () => {
  //     setShowLoadScreen(false)
  //   }, 2000)

  //   return ( () => {
  //     clearTimeout(timer)
  //   })
  // })

  return (
    <IonPage>
  
    
        <IonContent fullscreen>  
              <IonSegment onIonChange={e => toggleFormDisplay(e.detail.value) } value={showLogin ? "login" : "signup"}>
                <IonSegmentButton value="login">
                  <IonLabel>Login</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="signup">
                  <IonLabel>Signup</IonLabel>
                </IonSegmentButton>
              </IonSegment>

              {showLogin ?
                <LoginForm isOpen={showLogin} setChatSubscription={setChatSubscription}/>
              :
                <SignupForm isOpen={!showLogin} setChatSubscription={setChatSubscription} />
              }
        </IonContent>
      
    </IonPage>
  );
};

export default AuthPage;

const Card = styled(IonCard)``

const Content = styled(IonCardContent)`
  position: relative;
`


const SplashContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;

`
const Background = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`
const LogoContainer = styled.div`
`