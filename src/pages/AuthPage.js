import { IonContent, IonPage, IonSegment, IonSegmentButton, IonLabel} from '@ionic/react';
import { IonToolbar, IonFooter, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { logoGithub, logoLinkedin } from 'ionicons/icons'
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
        <IonFooter>
          <Toolbar>
              <IonButtons slot="start">
                <IonButton href="https://github.com/dsasse07/Dronie/blob/main/README.md" target="_blank" >
                  <IonIcon slot="icon-only" icon={logoGithub} />
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton href="https://www.linkedin.com/in/danny-sasse/" target="_blank" >
                  <IonIcon slot="icon-only" icon={logoLinkedin} />
                </IonButton>
              </IonButtons>
          </Toolbar>
        </IonFooter>
      
    </IonPage>
  );
};

export default AuthPage;

const Toolbar = styled(IonToolbar)`
  padding-left: 2vw;
  padding-right: 2vw;
`

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