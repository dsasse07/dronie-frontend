
import { useState, useRef, useEffect } from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent} from '@ionic/react';
import { IonAvatar, IonIcon, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { IonImg, IonPopover, IonAlert, IonGrid, IonRow, IonCol } from '@ionic/react'
import { trashOutline, ellipsisHorizontal, heart, heartOutline, chatbubbleOutline} from 'ionicons/icons'
import { createOutline, chevronDownOutline, send, pricetagOutline} from 'ionicons/icons'
import { ellipseOutline, ellipse, chevronForwardOutline, chevronBackOutline } from 'ionicons/icons'
import styled from 'styled-components'
import Comment from './Comment'
import { useSelector, useDispatch } from 'react-redux'
import { postsSlice, updatePost } from '../redux/postsSlice'
import { addCommentToUser } from '../redux/userSlice'
import avatarPlaceHolder from '../assets/avatar.jpg'
import { useStorage } from '@ionic/react-hooks/storage'
import { useHistory } from 'react-router-dom'

export const PostCard = ({post, onCommentDeleteClick, onPostDeleteClick, onEditPostClick}) => {
  const {created_at, description, date_taken, id, images, location, user} = post
  const currentUser = useSelector(state => state.currentUser)
  const dispatch = useDispatch()
  const { get } = useStorage()
  const commentsBottomRef = useRef()
  const [userLike, setUserLike] = useState( currentUserLikes() )
  const [showComments, setShowComments] = useState(false)
  const [showNewCommentForm, setShowNewCommentForm] = useState(false)
  const [newCommentText, setNewCommentText] = useState("")
  // const [ showConfirmDelete, setShowConfirmDelete ] = useState(false)
  const [ displayedImageIndex, setDisplayedImageIndex ] = useState(0)
  const [ showPostTags, setShowPostTags ] = useState({
    showPopover: false,
    event: undefined
  })
  const [ popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined
  })
  const history = useHistory()

  useEffect( () => {
    if (!showComments) return
    commentsBottomRef.current.scrollTop = post.comments.length*80
  }, [showComments])

  function toggleLike(){
    userLike ? handleUnlike() : handleLike()
  }

  function handleLike(){
    get("token")
      .then( token => {
        const likeConfig = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            user_id: currentUser.id,
            post_id: id
          })
        }
    
        fetch(`${process.env.REACT_APP_BACKEND}/likes/new`, likeConfig)
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
            dispatch( updatePost( data ) )
            setUserLike(true)
          })
          .catch((data) => {
            console.log(data.errors);
          });
      })
  }

  function handleUnlike(){
    get("token")
      .then( token => {
        const unlikeConfig = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
    
        fetch(`${process.env.REACT_APP_BACKEND}/likes/${id}`, unlikeConfig)
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
            dispatch( updatePost( data ) )
            setUserLike(false)
          })
          .catch((data) => {
            console.log(data.errors);
          });
      })
  }


  function currentUserLikes(){
    return currentUser.liked_posts.filter( post => post.id === id ).length > 0
  }

  function handleShowComments(){
    setShowComments( showComments => !showComments)
    setShowNewCommentForm(true)
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
    if (newCommentText.trim().length === 0) return
    get("token")
    .then( token => {
      const newComment = {
        user_id: currentUser.id,
        post_id: id,
        content: newCommentText.trim()
      }

      const newCommentConfig = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify( newComment )
      }

      fetch(`${process.env.REACT_APP_BACKEND}/comments/new`, newCommentConfig)
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
            setNewCommentText("")
            setShowComments(true)
            dispatch( addCommentToUser( data.comment ))
            dispatch( updatePost( data.post ) )
            setTimeout( () => {
              commentsBottomRef.current.scrollTop = commentsBottomRef.current?.scrollTop + 1000
            }, 0)
          })
          .catch((data) => {
            console.log(data.errors);
          });
      })
  }

  function handleShowPostTags(e){
    e.persist();
    setShowPostTags({ showPopover: true, event: e })
  }

  function openUsersPage(username){
    history.push(`/users/${username}`)
  }

  function handleImageChange(nextIndex){
    switch (true){
      case (nextIndex === images.length):
        setDisplayedImageIndex(0)
        break
      case (nextIndex < 0 ):
        setDisplayedImageIndex( images.length - 1 )
        break
      default:
        setDisplayedImageIndex(nextIndex)
        break
    }
  }


  const commentComponents = post.comments.map( (comment) => {
    return (
      <Comment 
        key={comment.id} 
        comment={comment} 
        showComments={showComments} 
        post={post}
        onCommentDeleteClick={onCommentDeleteClick}
        onViewUser={openUsersPage}
      />
    )
  })

  const trackerDots = images.map( ( _ , index) => {
    return(
      <IonIcon 
        icon={index === displayedImageIndex ? ellipse : ellipseOutline } 
        onClick={ () => setDisplayedImageIndex(index) }
        key={index}
        index={index}
      />
    )
  })

  return (
    <>
      <Card>

          <HeaderContainer>
            <IonItem>
              <IonAvatar onClick={() => openUsersPage(user.username)} >
                <img src={user.avatar ? user.avatar[0].secure_url : avatarPlaceHolder} alt={user.username}/>
              </IonAvatar>
            </IonItem>
            <HeaderText>
              <IonCardTitle> {user.username} </IonCardTitle>
              <IonCardSubtitle> Location: {location} </IonCardSubtitle>
              <IonCardSubtitle> Posted: {new Date(created_at).toDateString().slice(4) } </IonCardSubtitle>
            </HeaderText>
            { currentUser.id === user.id &&
                <MenuButton onClick={ (e) => {
                    e.persist();
                    setShowPopover({ showPopover: true, event: e })
                  }}
                >
                  <IonIcon icon={ellipsisHorizontal} />
                </MenuButton>
            }
          </HeaderContainer>

        <CardContent>
          <IonGrid>
            <ImageRow>
              <ImageContainer >
                <Img src={images[displayedImageIndex].secure_url} />
                { images.length > 1 && 
                  <>
                    <PrevImage onClick={() => handleImageChange(displayedImageIndex-1) }>
                      <IonIcon icon={chevronBackOutline} />
                    </PrevImage>
                    <NextImage onClick={() => handleImageChange(displayedImageIndex+1) }>
                      <IonIcon icon={chevronForwardOutline} />
                    </NextImage>
                  </>
                }
              </ImageContainer>
            </ImageRow>
            
            <IonRow>
              <IonCol>
                {trackerDots.length > 1 &&
                  <ImageTracker>
                    {trackerDots}
                  </ImageTracker>
                }
              </IonCol>
            </IonRow>

          <ControlsRow id="control">
            <ControlCol userLike={userLike} onClick={toggleLike}>
              <IonIcon icon={userLike ? heart : heartOutline} />
              {post.likes.length} Likes
            </ControlCol>
            <ControlCol onClick={handleShowPostTags}>
              <IonIcon icon={pricetagOutline} />
              Tags
            </ControlCol>
            <ControlCol onClick={handleShowNewCommentForm}>
              <IonIcon icon={chatbubbleOutline} />
              Comment
            </ControlCol>
          </ControlsRow >

          <hr></hr>

          <DescriptionRow>
            <IonCol>
              {description}
            </IonCol>
          </DescriptionRow>
          
          <CommentsRow>
            <CommentsCol>
              <CommentsContainer showComments={showComments} ref={commentsBottomRef}>
                {commentComponents.length > 0 ? 
                  commentComponents 
                : 
                <IonItem>
                  <IonLabel>No comments yet. Be the first!</IonLabel>
                </IonItem>
                }
                <div id="bottom" ref={commentsBottomRef}/>
              </CommentsContainer>
            </CommentsCol>
          </CommentsRow>

          {showNewCommentForm && 
            <NewCommentRow>
              <NewCommentCol >
                <form onSubmit={handleAddComment}>
                  <Input type="text" placeholder="New Comment" value={newCommentText} onIonChange={handleCommentTextChange}/> 
                  <Button type="submit" size="small">
                    <IonIcon icon={send}/>
                  </Button>
                </form>
              </NewCommentCol>
            </NewCommentRow>
          } 
            <ShowCommentsRow>
              <ShowCommentsCol>
                <ShowCommentsButton button onClick={handleShowComments} scroller={post}>
                  <IonLabel>
                    <Icon icon={chevronDownOutline} showComments={showComments} />
                    {showComments ? 'Hide' : 'Show'} Comments {`(${post.comments.length})`}
                    <Icon icon={chevronDownOutline} showComments={showComments}/>
                  </IonLabel>
                </ShowCommentsButton>
              </ShowCommentsCol>
            </ShowCommentsRow>
          </IonGrid>
        </CardContent>
      </Card>

      <IonPopover
        cssClass='my-custom-class'
        event={popoverState.event}
        isOpen={popoverState.showPopover}
        onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
        >
        <IonList>
          <EditPostItem onClick={ () => {
              onEditPostClick(id)
              setShowPopover({ showPopover: false, event: undefined })
            }}>
            <IonIcon icon={createOutline} slot="start"/>
            <IonLabel>Edit Post</IonLabel>
          </EditPostItem>
          <DeletePostItem onClick={ () => {
              onPostDeleteClick(id) 
              setShowPopover({ showPopover: false, event: undefined })
            }}
          >
            <IonIcon icon={trashOutline} slot="start" />
            <IonLabel color="danger" >Delete Post</IonLabel>
          </DeletePostItem>
        </IonList>
      </IonPopover>


      <PostTagsPopover
        cssClass='my-custom-class'
        event={popoverState.event}
        isOpen={showPostTags.showPopover}
        onDidDismiss={() => setShowPostTags({ showPopover: false, event: undefined })}
        >
        <IonList>
          { post?.tags?.length > 0 ?
            post?.tags.map( tag => {
              return(
                <IonItem key={tag.id}>
                  <IonLabel>
                    {tag.name}
                  </IonLabel>
                </IonItem>
              )
            })
          :
          <IonItem>
            <IonLabel>
              Not Tagged
            </IonLabel>
          </IonItem>
          }
        </IonList>
      </PostTagsPopover>
    </>
  );
};
export default PostCard




const Card = styled(IonCard)`
  display: grid;
  align-items: center;
  justify-content: center;
  max-width: 95%;
    /* @media (min-width: 800px) {
      max-width: fit-content;
    } */
`
//****************************************************** */
//************** Card Header Styling ******************* */
//****************************************************** */

const HeaderContainer = styled(IonCardHeader)`
  position: relative;
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

const DeleteContainer = styled.div`
  display: flex;
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
  color: var(--ion-color-danger-shade);

  ion-icon {
    font-size: 1.7rem;
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

const ImageRow = styled(IonRow)``
const ImageContainer = styled(IonCol)`
  position: relative;
  /* width: ; */
  ion-img{
    ::part(image){
      @media (min-width: 800px) {
        max-height: 70vh;
      }
    }
  }
`
const PrevImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 5px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 11px);
  width: 5vw;
  max-width: 50px;
  background: rgba(45, 45, 45, 0.2);
  transition: 0.1s ease-in-out;
  cursor: pointer;
  ion-icon{
    font-size: 1.4rem;
    opacity: 0.7;
  }

  :hover{
    background: rgba(45, 45, 45, 0.5);
    width: 8vw;
    max-width: 70px;
  }
`
const NextImage = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  margin-top: 5px;
  right: 0;
  top: 0;
  height: calc(100% - 11px);
  width: 5vw;
  max-width: 50px;
  background: rgba(45, 45, 45, 0.2);
  transition: 0.1s ease-in-out;
  cursor: pointer;

  ion-icon{
    font-size: 1.4rem;
    opacity: 0.7;
  }
  :hover{
    background: rgba(45, 45, 45, 0.5);
    width: 8vw;
    max-width: 70px;
  }
`

const ImageTracker = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 5px;
  cursor: pointer;
  

  ion-icon{
    font-size: 0.7rem;
  }
`


const Img = styled(IonImg)`
  max-width: 100%;
  /* object-fit: contain; */
`

const DescriptionRow = styled(IonRow)`
  font-size: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-bottom: 10px;
`

//****************************************************** */
//************** Card Controls Styling ***************** */
//****************************************************** */

const ControlsRow = styled(IonRow)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 3px;
  padding-bottom: 3px;
`

const ControlCol = styled(IonCol)`
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

//****************************************************** */
//************** Comment Form Styling ****************** */
//****************************************************** */

const NewCommentRow = styled(IonRow)``
const NewCommentCol = styled(IonCol)`
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

const CommentsRow = styled(IonRow)``
const CommentsCol = styled(IonCol)``
const CommentsContainer = styled(IonList)`
  max-height: ${props => props.showComments ? '200px' : '0' };
  padding-top: ${props => props.showComments ? '8px' : '0' };
  padding-bottom: ${props => props.showComments ? '8px' : '0' };
  transition: 0.3s;
  overflow-y: scroll;
  background: transparent;
  border: ${props => props.showComments && "1px solid"} ;
  width: 100%;
`

const ShowCommentsRow = styled(IonRow)``
const ShowCommentsCol = styled(IonCol)``
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


const DeletePostItem = styled(IonItem)`
  margin-top: 100px;
  cursor: pointer;
`

const LogOutItem = styled(IonItem)`
  margin-top: 15px;
  cursor: pointer;
`

const EditPostItem = styled(IonItem)`
  cursor: pointer;
`

const DeleteAccountConfirm = styled(IonAlert)``

const MenuButton = styled.div`
  position: absolute;
  top: 1%;
  right: 3%;
  cursor: pointer;
  font-size:1.3rem;
  padding: 5px;
  z-index: 1000;

  ion-icon {
    cursor: pointer;
  }
`

const PostTagsPopover = styled(IonPopover)``