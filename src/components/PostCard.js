
import { useState } from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent} from '@ionic/react';
import { IonAvatar, IonIcon, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { IonImg, IonRippleEffect } from '@ionic/react'
import { heart, heartOutline, chatbubbleOutline, chevronDownOutline, send} from 'ionicons/icons'
import styled from 'styled-components'
import Comment from './Comment'
import { useSelector } from 'react-redux'

export const PostCard = ({post}) => {
  const user = useSelector(state => state.user)
  const [userLikes, setUserLikes] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [showNewCommentForm, setShowNewCommentForm] = useState(false)
  const [newCommentText, setNewCommentText] = useState("")

  function toggleLike(){
    setUserLikes(userLikes => !userLikes)
  }
  
  function handleShowComments(){
    setShowComments( showComments => !showComments)
  }

  function handleShowNewCommentForm(){
    setNewCommentText("")
    setShowNewCommentForm( showNewCommentForm => !showNewCommentForm)
  }

  function handleCommentTextChange(event){
    setNewCommentText(event.target.value)
  }

  function handleAddComment(event){
    event.preventDefault()
  }


  const commentComponents = post.comments.map( (comment, index) => {
    return (
      <Comment key={index} comment={comment} showComments={showComments} />
    )
  })

  return (
    <Card>

        <HeaderContainer>
          <IonItem>
            <IonAvatar >
              <img src = "https://randomuser.me/api/portraits/med/men/75.jpg" />
            </IonAvatar>
          </IonItem>
          <HeaderText>
            <IonCardTitle> Username </IonCardTitle>
            <IonCardSubtitle> Photo Location </IonCardSubtitle>
          </HeaderText>
        </HeaderContainer>


      <CardContent>

        <ImageContainer >
          <Img src={post.url} />
        </ImageContainer>

        <ControlsBar id="control">
          <LikesContainer userLikes={userLikes} onClick={toggleLike}>
            <IonIcon icon={userLikes ? heart : heartOutline} />
            {post.likes} Likes
          </LikesContainer>
          <LeaveCommentContainer onClick={handleShowNewCommentForm}>
            <IonIcon icon={chatbubbleOutline} />
            Comment
          </LeaveCommentContainer>
        </ControlsBar >

        <hr></hr>

        <DescriptionContainer>
          Keep close to Nature's heart... and break clear away, once in awhile,
          and climb a mountain or spend a week in the woods. Wash your spirit clean.
        </DescriptionContainer>
        
        <CommentsContainer showComments={showComments}>
          {commentComponents}
        </CommentsContainer>
        {showNewCommentForm && 
        <NewCommentContainer >
          <form onSubmit={handleAddComment}>
            <Input type="text" placeholder="New Comment" value={newCommentText} onChange={handleCommentTextChange}/> 
            <Button type="submit" >
              <IonIcon icon={send}/>
            </Button>
          </form>
        </NewCommentContainer>
        } 

        <ShowCommentsButton button onClick={handleShowComments}>
          <Icon icon={chevronDownOutline} showComments={showComments} />
          <IonLabel>{showComments ? 'Hide' : 'Show'} Comments {`(${post.comments.length})`}</IonLabel>
          <Icon icon={chevronDownOutline} showComments={showComments}/>
        </ShowCommentsButton>

      </CardContent>
    </Card>
  );
};
export default PostCard




const Card = styled(IonCard)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1200px;
`
//****************************************************** */
//************** Card Header Styling ******************* */
//****************************************************** */

const HeaderContainer = styled(IonCardHeader)`
  align-items: center;
  display: flex;
  gap: 1rem;
  padding-left: 1rem;
  width: 100%;
  padding-bottom: 3px;
  
  && ion-item{
    --background: transparent;
    --border-color: transparent;
    --min-height: 40px;
  }
  && ion-avatar {
    cursor: pointer;
    width:50px !important;
    height: auto !important;
    border: 1px solid;
  }
`
const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  ion-card-title{
    cursor: pointer;
  }
`
//****************************************************** */
//************** Card Body Styling ********************* */
//****************************************************** */

const CardContent = styled(IonCardContent)`
  height: 100%;
  padding: 0.3rem;
  hr {
    border: 0;
    clear:both;
    display:block;
    width: 95%;               
    background-color: black;
    height: 1px;
    margin-top: 0;    
  }
`

const ImageContainer = styled.div``

const Img = styled(IonImg)``

const DescriptionContainer = styled.div`
  font-size: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
`

//****************************************************** */
//************** Card Controls Styling ***************** */
//****************************************************** */

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 3px;
  padding-bottom: 3px;
`

const LikesContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
font-size: 0.8rem;
font-weight: bold;
cursor: pointer;

  ion-icon {
    color: ${ ({userLikes}) => userLikes && "#c90000" };
    font-size: 1.3rem;
  }
`

const LeaveCommentContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
font-size: 0.8rem;
font-weight: bold;
cursor: pointer;

  ion-icon {
    font-size: 1.3rem;
  }
`


//****************************************************** */
//************** Comment Form Styling ****************** */
//****************************************************** */

const NewCommentContainer = styled.div`
  border: 1px solid;
  border-radius: 10px;
  margin-top: 8px;
  margin-bottom: 8px;
  
  form {
    display: flex;
    
    ion-button {
      --border-radius: 8px;
      margin-right: 4px;
    }
  }
  `

const Input = styled(IonInput)`
`

const Button = styled(IonButton)`
`

//****************************************************** */
//************** Card Comments Styling ***************** */
//****************************************************** */

const CommentsContainer = styled(IonList)`
  max-height: ${props => props.showComments ? '200px' : '0' };
  padding-top: ${props => props.showComments ? '8px' : '0' };
  padding-bottom: ${props => props.showComments ? '8px' : '0' };
  transition: 0.3s;
  overflow-y: ${props => props.showComments ? 'scroll' : 'hidden' };
  background: transparent;
`

const ShowCommentsButton = styled(IonItem)`
  && {
    font-size: 0.8rem;
    --background: transparent;
    --min-height: 35px;
    --border-color: transparent;
    ion-label{
      text-align: center;
      margin: 0;
      padding: 0;
    }
  }
`

const Icon = styled(IonIcon)`
  font-size: 0.9rem;
  transform: ${props => props.showComments ? 'rotateX(180deg)' : 'rotateX(0deg)' };
  transition: 0.5s;
`