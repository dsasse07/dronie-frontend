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
import meshGradientDark from '../assets/meshGradientDark.png'

function AuthPage ({setChatSubscription}) {
  const [ showLogin, setShowLogin ] = useState(true)
  const [ showLogo, setShowLogo ] = useState(false)

  useEffect(() => {
    setTimeout( () => {
      setShowLogo(showLogin)
    },100)
  }, [showLogin])

  function toggleFormDisplay(formToShow){
    setShowLogin( formToShow === "login")
  }

  return (
    <IonPage>

        <PageContent fullscreen>  
              <IonSegment onIonChange={e => toggleFormDisplay(e.detail.value) } value={showLogin ? "login" : "signup"}>
                <IonSegmentButton value="login">
                  <IonLabel>Login</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="signup">
                  <IonLabel>Signup</IonLabel>
                </IonSegmentButton>
              </IonSegment>

              {showLogin ?
                <>
                  <LogoContainer showLogo={showLogo}>
                    <img src={dronieLogo} />
                  </LogoContainer>
                  <LoginForm isOpen={showLogin} setChatSubscription={setChatSubscription}/>
                </>
              :
                <SignupForm isOpen={!showLogin} setChatSubscription={setChatSubscription} />
              }
        </PageContent>
      
    </IonPage>
  );
};

export default AuthPage;

// const Card = styled(IonCard)``

// const Content = styled(IonCardContent)`
//   position: relative;
// `


// const SplashContainer = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 100000;

// `
// const Background = styled.img`
//   height: 100%;
//   width: 100%;
//   object-fit: cover;
// `
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 1s;
  opacity: ${({showLogo}) => showLogo ? "100%" : "0%" };

  img {
    padding-top: 4vw;
    padding-bottom: 4vw;
    padding-left: 7vw;
    padding-right: 7vw;
  }

`

const PageContent = styled(IonContent)`
  --background: none;
  background-image: url(${meshGradient});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  @media (prefers-color-scheme: dark) {
    background-image: url(${meshGradientDark}); 
  }

`