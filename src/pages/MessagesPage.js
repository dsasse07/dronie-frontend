import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonNote, IonTextarea, IonText } from '@ionic/react';
import { IonItem, IonSegment, IonSegmentButton, IonIcon, IonLabel } from '@ionic/react';
import { IonGrid, IonRow, IonCol, IonList, IonFooter, IonButton } from '@ionic/react';
import { useIonViewDidLeave } from '@ionic/react';
import { send, mailOutline, checkmark, arrowBack } from 'ionicons/icons';
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom'
import { useStorage } from '@ionic/react-hooks/storage'
import avatarPlaceHolder from '../assets/avatar.jpg'
import styled from 'styled-components'
import { setChatWith } from '../redux/chatWithSlice';

function MessagesPage () {
  const { filter, query, results } = useSelector(state => state.search)
  const currentUser = useSelector(state => state.currentUser)
  const chatWith = useSelector(state => state.chatWith)
  const [ isFetching, setIsFetching ] = useState(false)
  const { register, handleSubmit, reset, setValue } = useForm( { defaultValues: { newMessageContent: "" } } )
  const messagesFeedRef = useRef()
  const dispatch = useDispatch()
  const history = useHistory()
  const { get } = useStorage()




  const today = new Date()
  const existingChat = findExistingChat()
  const messages = existingChat?.messages
  const otherUser = existingChat ? getOtherParticipant(existingChat) : {username: chatWith}
  let theirUnreadMessages = messages?.filter( message => {
    return (message.user_id !== currentUser.id && message.read === false)
  })
  
  useEffect( () => {
    messagesFeedRef.current.scrollToBottom()
    if (chatWith && theirUnreadMessages?.length > 0) markRead(theirUnreadMessages)
  }, [messages])

  useIonViewDidLeave( () => {
    dispatch( setChatWith(null) )
  })




  function handleSendMessage(formData, e){
    const newMessage = {
      chat_id: existingChat?.id,
      content: formData.newMessageContent,
      other_username: chatWith
    }
    setValue("newMessageContent", "")
    get("token")
      .then( token => {
        const newMessageConfig = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newMessage)
        }

        fetch(`${process.env.REACT_APP_BACKEND}/messages`, newMessageConfig)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              return response.json().then((data) => {
                throw data;
              });
            }
          }) 
          .then((data) => {
            messagesFeedRef.current.scrollToBottom()
          })
          .catch((data) => {
            console.log(data)
            // setNetworkErrors(data.errors);
          });
      })
  }

  function markRead(messages){
    get("token")
      .then( token => {
        const messagesConfig = {
          method: "PATCH",
          headers: {
            "Content-type":"application/json",
            Authorization: `Bearer ${token}`
          }, 
          body: JSON.stringify( { messages } )
        }

        fetch(`${process.env.REACT_APP_BACKEND}/messages`, messagesConfig)
      })
  }

  function goToProfile(){
    history.push(`/users/${currentUser.username}`)
  }

  function openUserPage(username){
    history.push(`/users/${username}`)
  }

  function belongsToMe(userId){
    return currentUser.id === userId
  }

  function findExistingChat(){
    return currentUser.chats.filter( ({participants}) => {
      return ( 
        participants[0].username === chatWith ||
        participants[1].username === chatWith
        )
      })[0]
  }

  function getOtherParticipant(existingChat){
    return existingChat.participants.filter( participant => {
      return participant.username === chatWith
    })[0]
  }




  const messageComponents = messages?.map( message => {
    const time = new Date(message.created_at).toLocaleString("en-US",{year:"numeric", month: "2-digit", day:"2-digit", hour: "numeric", minute: "numeric"})
    const seenAt = new Date(message.updated_at)

    const sameDay = ( 
                      today.getMonth() === seenAt.getMonth() &&
                      today.getDate() === seenAt.getDate()
                    )

    return (
      <MessageRow me={currentUser.id} sender={message.user_id} key={message.id}>
        <Message me={currentUser.id} sender={message.user_id}>
          { !belongsToMe(message.user_id) && 
            <UserAvatar onClick={ () => openUserPage(otherUser.username) }>
                <img src={otherUser.avatar ? JSON.parse(otherUser.avatar)[0].secure_url : avatarPlaceHolder } />
            </UserAvatar> 
          }
          <MessageContent me={currentUser.id} sender={message.user_id} >
            <IonNote>
              {time}
            </IonNote>
            <br/>
            {message.content}
            <br/>
            <SeenAtLabel me={currentUser.id} sender={message.user_id}>
              {message.read && 
                (
                  sameDay ? seenAt.toLocaleTimeString("en-US",{hour: "numeric", minute: "numeric"}) : seenAt.toLocaleString().slice(4)
                )
              }
            </SeenAtLabel>
            <SeenIndicator icon={message.read ? checkmark : mailOutline } me={currentUser.id} sender={message.user_id}/>
          </MessageContent>
          { belongsToMe(message.user_id) && 
            <UserAvatar  >
                <img src={currentUser.avatar.secure_url} alt={currentUser.username}/>
            </UserAvatar> 
          }
        </Message>
      </MessageRow>
    )
  })

  return (
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
          <OtherUserRow>
                <IonButton size="small" onClick={ () => dispatch( setChatWith(null) ) } >
                  <IonIcon icon={arrowBack} />
                </IonButton>
            <OtherUserCol>
              <OtherUserNameText onClick={ () => messagesFeedRef.current.scrollToBottom() }>
                {otherUser.username}
                
              </OtherUserNameText>
            </OtherUserCol>
          </OtherUserRow>
        </Toolbar>
      </Header>

      <IonContent scrollEvents={true} ref={messagesFeedRef} >

        <MessageGrid>
          {messageComponents?.length > 0 ?
            messageComponents
          :
            <NoMessages>
              <IonNote>
                No Messages
              </IonNote>
            </NoMessages>
          }
        </MessageGrid>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <NewMessageForm onSubmit={handleSubmit(handleSendMessage)}>
              <NewMessageTextarea
                name="newMessageContent"
                placeholder="Enter message"
                enterkeyhint="send"
                inputMode="text"
                ref={register({required: true, min: 1})}
                // onIonChange={(e) => setNewMessageContent(e.target.value)}
                // value={newMessageContent}
              />

            <SendButton size="small" slot="end" type="submit">
              <IonIcon icon={send} />
            </SendButton>
          </NewMessageForm>
      </IonToolbar>
      </IonFooter>
      </>
  // </IonPage>
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

const OtherUserRow = styled(IonRow)``
const OtherUserCol = styled(IonCol)`
  align-items: center;
  justify-content: center;
`
const OtherUserNameText = styled(IonTitle)`
  /* background: pink; */
  text-align: center;
`

const NoMessages = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1vh;
  width: 100%;
  height: 75vh;
`
const MessageGrid = styled(IonGrid)`
  /* border: 2px solid blue; */
  /* display: flex;
  flex-direction: column;
  gap: 10px; */
`
const MessageRow = styled(IonRow)`
  width: 100%;
  margin-bottom: 15px;
  /* border: 2px solid blue; */

`
const Message = styled(IonCol)`
  /* border: 2px solid pink; */
  display: flex;
  justify-content: ${ ({sender, me}) => sender === me ? "flex-end" : "flex-start"};
  align-items: flex-end;
  gap: 2vw;
`

const MessageContent = styled(IonLabel)`
  position: relative;
  width: 60%;
  max-width: 500px;
  border-radius: 5px;
  padding: 10px;
  padding-top: 5px;
  padding-bottom: 40px;
  padding-left: 25px;
  background: ${ ({sender, me}) => sender === me ? "#cef6ff" : "#a0ffe1"};
  box-shadow: var(--light-shadow);

  ion-note:first-of-type{
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 0.7rem;
  }
`

const SeenAtLabel = styled(IonNote)`
  position: absolute;
  bottom: 10%;
  font-size: 0.7rem;
  right: ${ ({sender, me}) => sender === me ? "" : "10%"};
  left: ${ ({sender, me}) => sender === me ? "10%" : ""};
`

const SeenIndicator = styled(IonIcon)`
  position: absolute;
  bottom: 10%;
  font-size: 0.7rem;
  right: ${ ({sender, me}) => sender === me ? "" : "3%"};
  left: ${ ({sender, me}) => sender === me ? "3%" : ""};

`
const StatusText = styled(IonNote)``
const UserAvatar = styled(IonAvatar)`
  height: 8vw;
  width: 8vw;
  max-height: 75px;
  max-width: 75px;
`

/************************************************** */

const NewMessageForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 3vw;
  margin-right: 3vw;
  gap: 2vw;
`

const NewMessageTextarea = styled(IonTextarea)`
  background: mistyrose;
  margin-bottom: 2vw;

`

const SendButton = styled(IonButton)`
`
