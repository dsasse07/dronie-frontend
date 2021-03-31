import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonPage} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { addCircleOutline, search, home, infinite, mailOutline, mailUnreadOutline } from 'ionicons/icons';
import Home from './pages/Home';
import PostNew from './pages/PostNew';
import SearchPage from './pages/SearchPage';
import SplashScreen from './components/SplashScreen'
import ContactsPage from './pages/ContactsPage'
import ProfilePage from './pages/ProfilePage'
import PostShowPage from './pages/PostShowPage'
import AuthPage from './pages/AuthPage'
import EditProfilePage from './pages/EditProfilePage'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentUser, updateUsersChat } from './redux/userSlice'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import DelayedRedirect from './components/DelayedRedirect'
import { useStorage } from '@ionic/react-hooks/storage'
import consumer from './cable'


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
  const currentUser = useSelector(state => state.currentUser)
  const [ chatSubscription, setChatSubscription ] = useState(null)
  const [ showLoadScreen, setShowLoadScreen ] = useState(true)

  const dispatch = useDispatch()
  const { get, remove } = useStorage()
  // If error and need to reset system, comment out useEffect, and uncomment remove()
  // remove("token")
  useEffect( () => {

    // const timer = setTimeout( () => {
    //   setShowLoadScreen(false)
    // }, 2000)

    get("token")
      .then( token => {
        if (token) {
          fetch(`${process.env.REACT_APP_BACKEND}/me`,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then( response => response.json() )
            .then( data => {
              dispatch( setCurrentUser(data) )
              const subscription = consumer.subscriptions.create({
                  channel: "ChatChannel",
                  "access-token": token,
                } , {
                  connected: () => (console.log("Connected")),
                  disconnected: () => (console.log("Disconnected")),
                  received: data => { dispatch( updateUsersChat(data) ) }
                })
              setChatSubscription(subscription)
            })
        }
      })

      // return( () => {
      //   clearTimeout(timer)
      // })
  }, [])

  function unreadMessageCount(){
    return currentUser?.chats.reduce( (total, chat) => {
      return total += chat.messages.filter( message => {
        return !message.read && message.user_id !== currentUser.id
      }).length
    }, 0 )
  }

  return (
    <IonApp>
      <IonReactRouter >
        { showLoadScreen &&
          <IonPage>
            <SplashScreen />
          </IonPage>
        }
          {currentUser && !showLoadScreen &&
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
                <Route path="/posts/:id">
                  <PostShowPage />
                </Route>
                <Route path="/users/:username">
                  <ProfilePage chatSubscription={chatSubscription} setChatSubscription={setChatSubscription}/>
                </Route>
                <Route path="/edit-profile">
                  <EditProfilePage />
                </Route>
                <Route path="/contacts">
                  <ContactsPage />
                </Route>
                <Route path="/login">
                  <Redirect to="/home" />
                </Route>
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
              </IonRouterOutlet>

              <IonTabBar slot="bottom" >
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
                <IonTabButton tab="contacts" href="/contacts">
                  <MessagesIcon 
                    icon={ currentUser && unreadMessageCount() > 0 ? mailUnreadOutline : mailOutline} 
                    unread={ unreadMessageCount() > 0 }
                  />
                  <IonLabel>Messages</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
}
            {/* : */}
            {!currentUser && !showLoadScreen &&
            <>
              <DelayedRedirect />
              <IonRouterOutlet>
                <Route path="/login">
                  <AuthPage setChatSubscription={setChatSubscription} />
                </Route>
              </IonRouterOutlet>
            </>
          }

      </IonReactRouter>
    </IonApp>
  ) 
}

export default App;

const TabBar = styled(IonTabBar)`
  height: ${ ({currentUser}) => !currentUser && "0" };
`

const MessagesIcon = styled(IonIcon)`
  color: ${ ({unread}) => unread ? "red" : ""};
`