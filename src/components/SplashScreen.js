import { IonContent, IonPage} from '@ionic/react';
import styled from 'styled-components'
import dronieLogo from '../assets/dronieLogo.png'
import meshGradient from '../assets/meshGradient.png'
import meshGradientDark from '../assets/meshGradientDark.png'

function SplashScreen() {
  return (
    // <IonPage>
      <IonContent fullscreen >
        <Background>
          <SplashContainer>
            <LogoContainer>
              <img src={dronieLogo} />
            </LogoContainer>
          </SplashContainer>
        </Background>
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

const Background = styled.div`
  height: 100%;
  width: 100%;
  background-image: url(${meshGradient});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;

  @media (prefers-color-scheme: dark) {
    background-image: url(${meshGradientDark});
  }
`
const LogoContainer = styled.div`
  /* background: rgba(239, 239, 239, 0.2); */
  
  @media (prefers-color-scheme: dark) {  
    /* background: rgba(20, 20, 20, 0.2); */
  }
  img {
    padding-top: 4vw;
    padding-bottom: 4vw;
    padding-left: 7vw;
    padding-right: 7vw;
  }
`