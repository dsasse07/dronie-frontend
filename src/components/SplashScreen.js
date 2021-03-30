import { IonContent, IonPage} from '@ionic/react';
import styled from 'styled-components'
import dronieLogo from '../assets/dronieLogo.png'
import meshGradient from '../assets/meshGradient.png'

function SplashScreen() {
  return (
    // <IonPage>
      <IonContent fullscreen >
        <Background src={meshGradient} />
        <SplashContainer>
          <LogoContainer>
          <img src={dronieLogo} />
          </LogoContainer>
        </SplashContainer>
      </IonContent>
    // </IonPage>
  )
}

export default SplashScreen


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