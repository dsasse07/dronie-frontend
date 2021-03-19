import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import styled from 'styled-components'
import { useSelector } from 'react-redux'

function Login () {
 
  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">Dronie</IonTitle>
          <IonAvatar slot="end">
            {/* <img src={currentUser.avatar}/> */}
          </IonAvatar>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

            Login       
      </IonContent>
    </IonPage>
  );
};

export default Login;