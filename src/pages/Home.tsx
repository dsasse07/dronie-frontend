import './Tab1.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAlert } from '@ionic/react'
import {IonInfiniteScroll, IonInfiniteScrollContent, IonAvatar, IonList } from '@ionic/react';
import {IonSegment, IonSegmentButton, IonItem, IonLabel } from '@ionic/react';
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import PostCard from '../components/PostCard'
import { useEffect, useState } from 'react'
import { setPosts, updatePost, removePost, clearPosts } from '../redux/postsSlice'
import { useStorage } from '@ionic/react-hooks/storage'
import { useHistory } from 'react-router-dom'
import { colorFillOutline, remove } from 'ionicons/icons';

function Home () {
  const currentUser = useSelector(state => state.currentUser)
  const posts = useSelector(state => state.posts)
  const dispatch = useDispatch()
  const [ isFetching, setIsFetching ] = useState(false)
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState(false)
  const [ commentToDelete, setCommentToDelete ] = useState(null)
  const [ postToDelete, setPostToDelete ] = useState(null)
  const [ postToEdit, setPostToEdit ] = useState(null)
  const { get } = useStorage()
  const history = useHistory()
  const [ feedType, setFeedType ] = useState("recent")


  useEffect( () => {
    if (posts.length === 0) setDisableInfiniteScroll(false)
    fetchPosts()

    return () => {
      dispatch( clearPosts([]) )
    }
  }, [feedType])

  function fetchPosts(){
    if (isFetching) return
    setIsFetching(true)

    fetch(`${process.env.REACT_APP_BACKEND}/posts?fetched_count=${posts.length}&display=${feedType}&user_id=${currentUser.id}`)
      .then( response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw data;
          });
        }
      })
      .then((data) => {
        console.log(`data`, data)
        if (data && data.length > 0){
          dispatch( setPosts(data) )
          setDisableInfiniteScroll(data.length < 5);
        } else {
          setDisableInfiniteScroll(true);
        }
        setIsFetching(false)
      })
      .catch(error => {
        setIsFetching(false)
        console.error(error)
      });
  }

  async function fetchNext(event) { 
    console.log("ding)")
    await fetchPosts();
    (event.target).complete();
  }

  function handleFeedChange(feedType){
    dispatch( clearPosts([]) )
    setFeedType(feedType)
    
  }

  function handleDeleteCommentClick(commentId){
    setCommentToDelete(commentId)
  }

  function handleDeleteComment(commentId){
    get("token")
    .then( token => {

      const deleteCommentConfig = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }

      fetch(`${process.env.REACT_APP_BACKEND}/comments/${commentId}`, deleteCommentConfig)
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
          })
          .catch((data) => {
            console.log(data.errors);
          });
      })
  }

  function goToProfile(){
    history.push(`/users/${currentUser.username}`)
  }


  function handleDeletePostClick(postId){
    setPostToDelete(postId)
  }

  function handleDeletePost(postId){
    get("token")
    .then( token => {

      const deletePostConfig = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }

      fetch(`${process.env.REACT_APP_BACKEND}/posts/${postId}`, deletePostConfig)
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
            dispatch( removePost( data ) )
            history.push("/home")
          })
          .catch((data) => {
            console.log(data.errors);
          });
      })
  }


  function handleEditPostClick(postId){
    setPostToEdit(postId)
  }

  function handleEditPost(formData){
    get("token")
    .then( token => {

      const patchPostConfig = {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      }

      fetch(`${process.env.REACT_APP_BACKEND}/posts/${postToEdit}`, patchPostConfig)
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
            dispatch( updatePost(data) )
            history.push(`/home`)
          })
          .catch((data) => {
            console.log(data.errors);
          });
      })
  }


  const postComponents = posts.map( post => {
    return (
      <PostCard 
        key={post.id} 
        post={post} 
        onCommentDeleteClick={handleDeleteCommentClick} 
        onPostDeleteClick={handleDeletePostClick}
        onEditPostClick={handleEditPostClick}
      />  
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

        <Segment onIonChange={e => handleFeedChange(e.detail.value) } value={feedType}>
          <SegmentButton value="followed_by">
            <SegmentLabel>Following</SegmentLabel>
          </SegmentButton>
          <SegmentButton value="recent">
            <SegmentLabel>Recent</SegmentLabel>
          </SegmentButton>
        </Segment>

        </Toolbar>
      </Header>

      <IonContent fullscreen >
        <IonAlert
          isOpen={commentToDelete !== null}
          onDidDismiss={() => setCommentToDelete(null) }
          cssClass='my-custom-class'
          header={'Confirm Delete'}
          message={'Are you sure you wish to delete your comment?'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Delete',
              role: 'delete',
              handler: () => {
                handleDeleteComment(commentToDelete);
              }
            }
          ]}
        />

        <IonAlert
          isOpen={postToDelete !== null}
          onDidDismiss={() => setPostToDelete(null) }
          cssClass='my-custom-class'
          header={'Confirm Delete'}
          message={'Are you sure you wish to delete your post?'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Delete',
              role: 'delete',
              handler: () => {
                handleDeletePost(postToDelete);
              }
            }
          ]}
        />

        <IonAlert
          isOpen={postToEdit !== null}
          onDidDismiss={() => setPostToEdit(null) }
          cssClass='my-custom-class'
          header={'Edit Post'}
          message={'Enter details about your photos below:'}
          inputs={[
            {
              name: 'date_taken',
              type: 'date',
              placeholder: 'Date Taken'
            },
            {
              name: 'location',
              type: 'text',
              placeholder: 'Location'
            },
            {
              name: 'description',
              type: 'textarea',
              placeholder: 'Tell us about the photo'
            },
          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Save',
              role: 'confirm',
              handler: (e) => {
                handleEditPost(e);
              }
            }
          ]}
        />
      
        <List>
          {postComponents}
        </List>

        <IonInfiniteScroll 
          threshold="50%" 
          disabled={disableInfiniteScroll}
          onIonInfinite={fetchNext}
        >
          <IonInfiniteScrollContent
            loadingText="Loading more good doggos...">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>

      </IonContent>
    </IonPage>
  );
};

export default Home;

const List = styled(IonList)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

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

const Segment = styled(IonSegment)``
const SegmentButton = styled(IonSegmentButton)``
const SegmentLabel = styled(IonLabel)``
