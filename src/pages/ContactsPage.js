import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonNote } from '@ionic/react';
import { IonItem, IonSegment, IonSegmentButton, IonSearchbar, IonLabel } from '@ionic/react';
import { IonGrid, IonRow, IonCol, IonList, IonLoading } from '@ionic/react';
import { IonBadge, IonBackButton,  } from '@ionic/react';
import { setQuery, setFilter, setUserResults, setPostResults, clearResults } from '../redux/searchSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import avatarPlaceHolder from '../assets/avatar.jpg'
import styled from 'styled-components'
import MessagePage from '../pages/MessagesPage'
import { current } from 'immer';
import { setChatWith } from '../redux/chatWithSlice';

function ContactsPage () {
  const { filter, query, results } = useSelector(state => state.search)
  const currentUser = useSelector(state => state.currentUser)
  const chatWith = useSelector(state => state.chatWith)
  const [ isFetching, setIsFetching ] = useState(false)
  // const [ chatWith, setChatWith ] = useState(null)
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
    dispatch( setChatWith(username) )
  }

  function getOtherParticipant(existingChat){
    return existingChat.participants.filter( participant => {
      return participant.username !== currentUser.username
    })[0]
  }

  const followerIds = currentUser.followers.map( follower => {
    return follower.id
  })

  const recentContacts = currentUser && [...currentUser.chats].sort( (chat1, chat2) => {
      return new Date(chat2.messages.slice(-1)[0].created_at) - new Date(chat1.messages.slice(-1)[0].created_at)
    }).map( chat => {
      return { 
        participant: getOtherParticipant(chat),
        lastMessage: chat.messages.slice(-1)[0],
        unreadCount: chat.messages.filter( message => message.read === false ).length 
      }
    })
  
  const recentContactIds = recentContacts.map( contact => contact.participant.id)

  const otherFriends = currentUser && currentUser.following.filter( followed => {
    return (followerIds.includes( followed.id ) && !recentContactIds.includes(followed.id) )
  })

  const otherFriendComponents = otherFriends?.map( friend => {
    console.log(friend)
    return ( 
      <Contact 
        key={friend.id}
        id={friend.id}
        avatar={friend.avatar}
        username={friend.username}
      /> 
    )
  })
  
  const recentContactComponents = recentContacts?.map( ({participant, unreadCount, lastMessage}) => {
    return (
      <Contact
        key={participant.id} 
        id={participant.id} 
        avatar={participant.avatar} 
        username={participant.username}
        lastMessage={lastMessage}
        unreadCount={unreadCount}
        />
    )
  })


  return (
    <IonPage>
      { chatWith ?
        <MessagePage />
      :

 
      <>
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
          {recentContactComponents}
          {otherFriendComponents}
        </ContactList>

      </IonContent>
      </>
    } 
    </IonPage>
  );
};



function Contact ({ id, avatar, username, lastMessage, unreadCount = 0}){
  const dispatch = useDispatch()
  
  return (
    <ContactRow key={id} onClick={() => { dispatch( setChatWith(username) ) }} >
      <ContactAvatar >
        <img src={avatar ? JSON.parse(avatar)[0].secure_url : avatarPlaceHolder } />
      </ContactAvatar>
      <TextCol>
        <IonRow>
          <ContactLabel>
            {username}
          </ContactLabel>
          { unreadCount > 0 &&
            <IonBadge color="primary" >
              { unreadCount } 
            </IonBadge>
          }
        </IonRow> 
        <IonRow>
          { lastMessage && 
            <LastMessage read={lastMessage?.read} >
              {lastMessage?.content}
            </LastMessage>
          }
        </IonRow>
      </TextCol>
    </ContactRow>
  )
}

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
const AvatarCol = styled(IonCol)`
  
`

const TextCol = styled(IonCol)`
  flex-grow: 1;
`
const ContactLabel = styled(IonLabel)`
  flex-grow: 2;
  font-size: 1.1rem;
  font-weight: bold;
`

const LastMessage = styled(IonNote)`
  font-weight: ${ ({read}) => read ? "" : "bold" };
  font-size: 0.8rem;
  height: calc( 1rem * 2);
  overflow: hidden;
`

const ContactAvatar = styled(IonAvatar)`
  margin: 0.5vw;
  
  width: 10vw;
  height: 10vw;
  border: 1px solid;
`
