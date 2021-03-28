import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonNote } from '@ionic/react';
import { IonItem, IonSegment, IonSegmentButton, IonIcon, IonLabel } from '@ionic/react';
import { IonInput, IonRow, IonCol, IonList, IonButton } from '@ionic/react';
import { IonBadge, IonBackButton,  } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import avatarPlaceHolder from '../assets/avatar.jpg'
import styled from 'styled-components'
import MessagePage from '../pages/MessagesPage'
import { setChatWith } from '../redux/chatWithSlice';

function ContactsPage () {
  const currentUser = useSelector(state => state.currentUser)
  const chatWith = useSelector(state => state.chatWith)
  const [ query, setQuery ] = useState("")
  const dispatch = useDispatch()
  const history = useHistory()

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
        unreadCount: chat.messages.filter( message => message.user_id !== currentUser.id && message.read === false ).length 
      }
    })
  
  const recentContactIds = recentContacts.map( contact => contact.participant.id)

  const otherFriends = currentUser && currentUser.following.filter( followed => {
    return (followerIds.includes( followed.id ) && !recentContactIds.includes(followed.id) )
  })

  const filteredRecentContacts = recentContacts?.filter( ({participant}) => {
    return participant.username.includes(query)
  })
  
  const recentContactComponents = filteredRecentContacts?.map( ({participant, unreadCount, lastMessage}) => {
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

          <IonInput
            value={query} 
            onIonChange={e => { setQuery( (e.detail.value) ) } } 
            type="search"
            placeholder="Search..."
            >
          <ClearButton size="small" slot="end" onClick={ () => setQuery("") } >
            <ClearIcon icon={close} />
          </ClearButton>
          </IonInput>
        </Toolbar>
      </Header>

      <IonContent fullscreen>

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

const ClearButton = styled(IonButton)``
const ClearIcon = styled(IonIcon)``

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
