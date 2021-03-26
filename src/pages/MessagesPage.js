import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonNote } from '@ionic/react';
import { IonItem, IonSegment, IonSegmentButton, IonSearchbar, IonLabel } from '@ionic/react';
import { IonGrid, IonRow, IonCol, IonList, IonLoading } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux'
import { setChat, addMessage, clearChat } from '../redux/chatSlice'
import { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import avatarPlaceHolder from '../assets/avatar.jpg'
import styled from 'styled-components'
import { current } from 'immer';

function MessagesPage () {
  const { filter, query, results } = useSelector(state => state.search)
  const currentUser = useSelector(state => state.currentUser)
  const {id, participants, messages } = useSelector( state => state.chat )
  const [ isFetching, setIsFetching ] = useState(false)
  const [ otherUser, setOtherUser ] = useState({})
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams()

  useEffect( () => {
    const thisChat = currentUser.chats.filter( ({participants}) => {
      return ( 
        participants[0].username === params.username ||
        participants[1].username === params.username
      )
    })[0]
    setOtherUser( thisChat?.participants.filter( participant => {
      return participant.username === params.username
    })[0]
    )
    dispatch( setChat( thisChat ) )

    return( () => {
      dispatch( clearChat([]) )
    })
  }, [params.username])

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

  function goToProfile(){
    history.push(`/users/${currentUser.username}`)
  }

  function openUserPage(username){
    history.push(`/users/${username}`)
  }

//   const MessageRow = styled(IonRow)``
// const Message = styled(IonCol)``
// const StatusText = styled(IonNote)``
// const userAvatar = styled(I

// function me(userId){
//   return currentUser.id === userId
// }

  const messageComponents = messages?.map( message => {
    return (
      <MessageRow me={currentUser.id} sender={message.user_id}>
        <Message me={currentUser.id} sender={message.user_id}>
          <MessageContent me={currentUser.id} sender={message.user_id} >
            {message.content}
          </MessageContent>
        </Message>
      </MessageRow>
    )
  })

console.log(`message`, messages)


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
        </Toolbar>
      </Header>

      <IonContent fullscreen>

        <MessageGrid>
          {messageComponents?.length > 0 ?
            messageComponents
          :
            <NoMessages>
              No Messages
            </NoMessages>
          }
        </MessageGrid>

      </IonContent>
    </IonPage>
  );
};

export default MessagesPage;


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
const ContactList = styled(IonList)``
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
/******************************************* */

const NoMessages = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1vh;
  width: 100%;
  height: 75vh;
`
const MessageGrid = styled(IonGrid)`
  border: 2px solid blue;
`
const MessageRow = styled(IonRow)`
  width: 100%;
  border: 2px solid blue;
`
const Message = styled(IonCol)`
  border: 2px solid pink;
`
const MessageContent = styled(IonLabel)`
  background: ${ ({sender, me}) => sender === me ? "pink" : "blue"};
`
const StatusText = styled(IonNote)``
const userAvatar = styled(IonAvatar)``