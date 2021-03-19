import './Tab1.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import styled from 'styled-components'
import { useSelector } from 'react-redux'

function SearchPage () {

  const currentUser = useSelector(state => state.currentUser)


  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">Dronie</IonTitle>
          <IonAvatar slot="end">
            <img src={currentUser.avatar.secure_url}/>
          </IonAvatar>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

            Search Page        
      </IonContent>
    </IonPage>
  );
};

export default SearchPage;





