import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { addCircleOutline, search, home, infinite } from 'ionicons/icons';
import Home from './pages/Home';
import PostNew from './pages/PostNew';
import SearchPage from './pages/SearchPage';
import Infinite from './pages/Inifnite'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';


function App() {


  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/new">
              <PostNew />
            </Route>
            <Route path="/search">
              <SearchPage />
            </Route>
            <Route path="/infinite">
              <Infinite />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="new" href="/new">
              <IonIcon icon={addCircleOutline} />
              <IonLabel>New</IonLabel>
            </IonTabButton>
            <IonTabButton tab="search" href="/search">
              <IonIcon icon={search} />
              <IonLabel>Search</IonLabel>
            </IonTabButton>
            <IonTabButton tab="infinite" href="/infinite">
              <IonIcon icon={infinite} />
              <IonLabel>Infinite</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>

      </IonReactRouter>
    </IonApp>
  ) 
}

export default App;