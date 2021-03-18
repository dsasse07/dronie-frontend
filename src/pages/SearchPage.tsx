import './Tab1.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import styled from 'styled-components'
import { useSelector } from 'react-redux'

function SearchPage () {

  const user = useSelector(state => state.user)


  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">Dronie</IonTitle>
          <IonAvatar slot="end">
            <img src={user.picture.thumbnail}/>
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





