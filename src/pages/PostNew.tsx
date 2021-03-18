import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/react';
import { logoFacebook, logoTwitter, logoYoutube, logoPwa, logoNpm, logoIonic, logoGithub, logoJavascript, logoAngular, logoVimeo, logoChrome, logoReact } from 'ionicons/icons';
import { useSelector } from 'react-redux'

import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

const PostNew: React.FC = () => {
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
      <IonFab vertical="center" horizontal="center">
      <IonFabButton>Share</IonFabButton>
      <IonFabList side="top">
        <IonFabButton>
          <IonIcon icon={logoFacebook} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoTwitter} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoYoutube} />
        </IonFabButton>
      </IonFabList>

      <IonFabList side="end">
        <IonFabButton>
          <IonIcon icon={logoPwa} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoNpm} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoIonic} />
        </IonFabButton>
      </IonFabList>

      <IonFabList side="bottom">
        <IonFabButton>
          <IonIcon icon={logoGithub} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoJavascript} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoAngular} />
        </IonFabButton>
      </IonFabList>

      <IonFabList side="start">
        <IonFabButton>
          <IonIcon icon={logoVimeo} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoChrome} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={logoReact} />
        </IonFabButton>
      </IonFabList>
    </IonFab>



        {/* <ExploreContainer name="New Post" /> */}
      </IonContent>
    </IonPage>
  );
};

export default PostNew;
