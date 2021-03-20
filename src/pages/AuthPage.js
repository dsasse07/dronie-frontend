import { IonContent, IonPage, IonSegment, IonSegmentButton, IonLabel} from '@ionic/react';
import { IonCard, IonCardContent } from '@ionic/react';
import SignupForm from '../components/SignupForm'
import LoginForm from '../components/LoginForm'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'

function AuthPage () {
  const [ showLogin, setShowLogin ] = useState(true)

  function toggleFormDisplay(formToShow){
    setShowLogin( formToShow === "login")
  }

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
        {/* <Card> */}

          {/* <Content> */}
            
            {showLogin ?
              <LoginForm isOpen={showLogin}/>
            :
              <SignupForm isOpen={!showLogin}/>
            }

          {/* </Content> */}
        {/* </Card> */}
      </IonContent>
    </IonPage>
  );
};

export default AuthPage;

const Card = styled(IonCard)``

const Content = styled(IonCardContent)``