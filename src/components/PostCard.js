
import { useState, useRef, useEffect } from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent} from '@ionic/react';
import { IonAvatar, IonIcon, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { IonImg } from '@ionic/react'
import { heart, heartOutline, chatbubbleOutline, chevronDownOutline, send} from 'ionicons/icons'
import styled from 'styled-components'
import Comment from './Comment'
import { useSelector, useDispatch } from 'react-redux'
import { postsSlice, updatePost } from '../redux/postsSlice'
import avatarPlaceHolder from '../assets/avatar.jpg'

export const PostCard = ({post}) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const commentsBottomRef = useRef()
  const [userLike, setUserLike] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [showNewCommentForm, setShowNewCommentForm] = useState(false)
  const [newCommentText, setNewCommentText] = useState("")
  const {created_at, description, date_taken, id, images, location, user} = post

  useEffect( () => {
    if (!showComments) return
    // commentsBottomRef.current.scrollTop = post.comments.length*80
  }, [showComments])

  function toggleLike(){
    setUserLike(userLike => !userLike)
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
    // event.preventDefault()
    // const newComment = {
    //   username: currentUser.username,
    //   content: newCommentText
    // }
    // const updatedPost = {...post, comments: [...post.comments, newComment]}
    // dispatch( updatePost(updatedPost) )
    // setNewCommentText("")
    // setTimeout( () => {
    //   commentsBottomRef.current.scrollTop = commentsBottomRef.current?.scrollTop + 50
    // }, 0)
  }


  // const commentComponents = post.comments.map( (comment, index) => {
  //   return (
  //     <Comment key={index} comment={comment} showComments={showComments} />
  //   )
  // })

  return (
    <Card>

        <HeaderContainer>
          <IonItem>
            <IonAvatar >
              <img src={user.avatar ? user.avatar[0].secure_url : avatarPlaceHolder} alt={user.username}/>
            </IonAvatar>
          </IonItem>
          <HeaderText>
            <IonCardTitle> {user.username} </IonCardTitle>
            <IonCardSubtitle> {location} </IonCardSubtitle>
          </HeaderText>
        </HeaderContainer>


      <CardContent>

        <ImageContainer >
          <Img src={images[0].secure_url} />
        </ImageContainer>

        <ControlsBar id="control">
          <LikesContainer userLike={userLike} onClick={toggleLike}>
            <IonIcon icon={userLike ? heart : heartOutline} />
            {/* {post.likes} Likes */}
          </LikesContainer>
          <LeaveCommentContainer onClick={handleShowNewCommentForm}>
            <IonIcon icon={chatbubbleOutline} />
            Comment
          </LeaveCommentContainer>
        </ControlsBar >

        <hr></hr>

        <DescriptionContainer>
          {description}
        </DescriptionContainer>
        
          <CommentsContainer showComments={showComments} ref={commentsBottomRef}>
            {/* {commentComponents} */}
            <div id="bottom" ref={commentsBottomRef}/>
          </CommentsContainer>
        {showNewCommentForm && 
        <NewCommentContainer >
          <form onSubmit={handleAddComment}>
            <Input type="text" placeholder="New Comment" value={newCommentText} onIonChange={handleCommentTextChange}/> 
            <Button type="submit" >
              <IonIcon icon={send}/>
            </Button>
          </form>
        </NewCommentContainer>
        } 

        <ShowCommentsButton button onClick={handleShowComments} scroller={post}>
          <IonLabel>
            <Icon icon={chevronDownOutline} showComments={showComments} />
            {/* {showComments ? 'Hide' : 'Show'} Comments {`(${post.comments.length})`} */}
            <Icon icon={chevronDownOutline} showComments={showComments}/>
          </IonLabel>
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
    height: 50px !important;
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
  margin-bottom: 10px;
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
    color: ${ ({userLike}) => userLike && "#c90000" };
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
  overflow-y: scroll;
  background: transparent;
  border: ${props => props.showComments && "1px solid"} ;
`

const ShowCommentsButton = styled(IonItem)`
  && {
    font-size: 0.8rem;
    --background: transparent;
    --min-height: 35px;
    --border-color: transparent;
    ion-label{
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin: 0;
      ion-icon {
        padding-left: 8px;
        padding-right: 8px;
      }
    }
  }
`

const Icon = styled(IonIcon)`
  font-size: 0.9rem;
  transform: ${props => props.showComments ? 'rotateX(180deg)' : 'rotateX(0deg)' };
  transition: 0.5s;
`