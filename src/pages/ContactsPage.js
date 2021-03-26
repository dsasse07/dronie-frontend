import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import { IonItem, IonSegment, IonSegmentButton, IonSearchbar, IonLabel } from '@ionic/react';
import { IonGrid, IonRow, IonCol, IonList, IonLoading } from '@ionic/react';
import { IonInfiniteScrollContent, IonButtons, IonBackButton,  } from '@ionic/react';
import { setQuery, setFilter, setUserResults, setPostResults, clearResults } from '../redux/searchSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import avatarPlaceHolder from '../assets/avatar.jpg'
import styled from 'styled-components'

function ContactsPage () {
  const { filter, query, results } = useSelector(state => state.search)
  const currentUser = useSelector(state => state.currentUser)
  const [ isFetching, setIsFetching ] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  function fetchResults(){
    const urlParams = `/search?filter=${filter}&q=${query}&fetched=${results[filter].length}`
    // fetch(`${process.env.REACT_APP_BACKEND}${urlParams}`)
    //   .then( response => {
    //     if (response.ok) {
    //       return response.json();
    //     } else {
    //       return response.json().then((data) => {
    //         throw data;
    //       });
    //     }
    //   })
    //   .then((data) => {
    //     if (data && data.length > 0){
    //       (filter === "users") ? dispatch( setUserResults(data) ) : dispatch( setPostResults(data) )
    //       setDisableInfiniteScroll(data.length < 30);
    //     } else {          
    //       setDisableInfiniteScroll(true);
    //     }
    //     setIsFetching(false)
    //   })
    //   .catch(error => {
    //     setIsFetching(false)
    //     console.error(error)
    //   });
  }

  async function fetchNext(event) { 
    console.log('ding')
    await fetchResults();
    (event.target).complete();
  }

  function handleSearchSubmit(e){
    if (e.key !== "Enter" || query === "") return
    dispatch( clearResults([]) )
    fetchResults()
  }
  
  function goToProfile(){
    history.push(`/users/${currentUser.username}`)
  }

  function openChat(username){
    history.push(`/messages/${username}`)
  }

  const followerIds = currentUser.followers.map( follower => {
    return follower.id
  })

  const friends = currentUser && currentUser.following.filter( followed => {
    return followerIds.includes( followed.id )
  })

  const contactComponents = friends.map( friend => {
    return (
        <ContactRow onClick={() => {openChat(friend.username)}}>
            <ContactAvatar>
              <img src={friend.avatar ? JSON.parse(friend.avatar)[0].secure_url : avatarPlaceHolder } />
            </ContactAvatar>
            <ContactLabel>
              {friend.username}
            </ContactLabel>
        </ContactRow>
    )
  })

  return (
    <IonPage>

      <Header >
        <Toolbar>
          <Item>
            <Title slot="start">
              Dronie
            </Title>
            <Avatar slot="end" onClick={goToProfile}>
              <img src={currentUser.avatar.secure_url} alt={currentUser.username}/>
            </Avatar>
          </Item>
          <IonSearchbar 
            // value={query} 
            // onIonChange={e => {
            //   dispatch( setQuery( (e.detail.value!) ) )
            //   }
            // } 
            // onKeyUp={handleSearchSubmit}
            animated
            showClearButton="always"
            placeholder="Search..."
          >
          </IonSearchbar>
        </Toolbar>
      </Header>

      <IonContent fullscreen>
        <IonLoading
          // isOpen={isFetching}
          message={'Searching...'}
        />

        <ContactList>
          {contactComponents}
          {contactComponents}
          {contactComponents}
          {contactComponents}
          {contactComponents}
        </ContactList>


      

      </IonContent>

    </IonPage>
  );
};

export default ContactsPage;


const Header = styled(IonHeader)``
const Toolbar = styled(IonToolbar)`
  padding-right: 10px;
`
const Title = styled(IonTitle)`
  font-size: 1.8rem;
`
const Avatar = styled(IonAvatar)`
    width:50px !important;
    height: 50px !important;
    border: 1px solid;
    cursor: pointer;
`
const Item = styled(IonItem)`
  --border-color: transparent;
` 

/***************** Segment Bar ******************** */

const Segment = styled(IonSegment)`
`
const SegmentButton = styled(IonSegmentButton)``
const SegmentLabel = styled(IonLabel)``

/************************************************ */
const ContactList = styled(IonList)`
  margin: 4px;
`
const ContactRow = styled(IonRow)`
  align-items: center;
  gap: 20px;
  padding: 8px;
  padding-left: 5vw;
  border-bottom: 1px solid;
  transition: 0.2s ease-in-out;
  cursor: pointer;

  :hover{
    transform: translateX(5vw);
  }
`
const ContactLabel = styled(IonLabel)`
  flex-grow: 2;
  font-size: 1.3rem;
  
`

const ContactAvatar = styled(IonAvatar)`
  margin: 0.5vw;
  
  width: 10vw;
  height: 10vw;
  border: 1px solid;
`
