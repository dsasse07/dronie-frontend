import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import LoginSignupForm from '../components/LoginSignupForm'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

function Login () {
 
  return (
    <IonPage>
      <IonContent fullscreen>

            <LoginSignupForm />

      </IonContent>
    </IonPage>
  );
};

export default Login;