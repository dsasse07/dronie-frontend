import './Tab1.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAlert } from '@ionic/react'
import {IonInfiniteScroll, IonInfiniteScrollContent, IonAvatar, IonList } from '@ionic/react';
import {IonSegment, IonSegmentButton, IonItem, IonLabel } from '@ionic/react';
import {IonFab, IonFabButton, IonIcon, IonLoading, IonCol, IonRow } from '@ionic/react';
import { arrowUpOutline, refreshOutline } from 'ionicons/icons'
import { useSelector, useDispatch } from 'react-redux'
import { setPosts, updatePost, removePost, clearPosts } from '../redux/postsSlice'
// import { setTags } from '../redux/tagsSlice'
import styled from 'styled-components'
import PostCard from '../components/PostCard'
import { useEffect, useState, useRef } from 'react'
import { useStorage } from '@ionic/react-hooks/storage'
import { useHistory } from 'react-router-dom'
import meshGradient from '../assets/meshGradient.png'
import meshGradientDark from '../assets/meshGradientDark.png'
import dronePiece from '../assets/dronePiece.png'
import namePiece from '../assets/namePiece.png'

function Home () {
  const currentUser = useSelector(state => state.currentUser)
  const posts = useSelector(state => state.posts)
  const tags = useSelector(state => state.tags)
  const dispatch = useDispatch()
  const [ isFetching, setIsFetching ] = useState(false)
  const [ fetchInitial, setFetchInitial ] = useState(true)
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState(false)
  const [ commentToDelete, setCommentToDelete ] = useState(null)
  const [ postToDelete, setPostToDelete ] = useState(null)
  const [ postToEdit, setPostToEdit ] = useState(null)
  const [ scrollPosition, setScrollPosition ] = useState(0)
  const { get } = useStorage()
  const contentRef = useRef<HTMLIonContentElement>(null)
  const topOfFeedRef = useRef<HTMLDivElement>(null)
  const history = useHistory()
  const [ feedType, setFeedType ] = useState("recent")


  useEffect( () => {
    if (posts.length === 0) setDisableInfiniteScroll(false)
    fetchPosts()
    // fetchTags()

    return () => {
      dispatch( clearPosts([]) )
      setFetchInitial(true)
    }
  }, [feedType])

  function fetchPosts(count = posts.length){
    if (isFetching) return
    setIsFetching(true)

    fetch(`${process.env.REACT_APP_BACKEND}/posts?fetched_count=${count}&display=${feedType}&user_id=${currentUser.id}`)
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
        if (data && data.length > 0){
          dispatch( setPosts(data) )
          setDisableInfiniteScroll(data.length < 5);
        } else {
          setDisableInfiniteScroll(true);
        }
        setIsFetching(false)
        setFetchInitial(false)
      })
      .catch(error => {
        setIsFetching(false)
        console.error(error)
      });
  }

  async function fetchNext(event) { 
    await fetchPosts();
    (event.target).complete();
  }

  // function fetchTags() {
  //   fetch(`${process.env.REACT_APP_BACKEND}/tags`)
  //     .then((response) => {
  //       if (response.ok) {
  //         return response.json();
  //       } else {
  //         return response.json().then((data) => {
  //           throw data;
  //         });
  //       }
  //     })
  //     .then((data) => {
  //       dispatch( setTags(data) )
  //     })
  //     .catch((data) => {
  //       console.log(data.errors);
  //     })
  // }

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
            dispatch( removePost( data.id ) )
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

  function handleFabClick(){
    if (scrollPosition > 800) {
      contentRef.current.scrollToPoint(0,0,1000)
    } else {
      dispatch( clearPosts( [] ) )
      setDisableInfiniteScroll(false)
      fetchPosts(0)
    }
  }
  

  const postComponents = posts.map( (post, index) => {
    return (
      <PostCard 
        key={index} 
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
            {/* <Title slot="start">
              Dronie
            </Title> */}
            <HeaderRow>
              <HeaderCol>
                <LogoImage src={dronePiece} />
              </HeaderCol>
              <HeaderCol>
                <NameImage src={namePiece} />
              </HeaderCol>
              <HeaderCol>
                <Avatar  onClick={goToProfile}>
                  <img src={currentUser.avatar.secure_url} alt={currentUser.username}/>
                </Avatar>
              </HeaderCol>
            </HeaderRow>
          </Item>

        <Segment 
          value={currentUser.following.length > 0 ? feedType : "recent"}
          disabled={currentUser.following.length === 0}
          onIonChange={e => handleFeedChange(e.detail.value) }
          >
            <SegmentButton value="followed_by">
              <SegmentLabel>
                Following
              </SegmentLabel>
            </SegmentButton>
            <SegmentButton value="recent">
              <SegmentLabel>Recent</SegmentLabel>
            </SegmentButton>
        </Segment>

        </Toolbar>
      </Header>

      <Content fullscreen ref={contentRef} scrollEvents={true} onIonScroll={(e)=>setScrollPosition(e.detail.scrollTop)} >
        <IonLoading
          isOpen={fetchInitial}
          message={'Loading...'}
        />
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

        <IonFab vertical="bottom" horizontal="end"  slot="fixed">
          <FabButton size="small" >
            <IonIcon icon={scrollPosition > 800 ? arrowUpOutline : refreshOutline } onClick={handleFabClick}/>
          </FabButton>
        </IonFab>
        
        <div id="top" ref={topOfFeedRef} />
        <List >
          {postComponents.length > 0 ?
            postComponents
          :
            <NoPostsFound>
              The users you follow have no posts.
            </NoPostsFound>
          }
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

      </Content>
    </IonPage>
  );
};

export default Home;

const List = styled(IonList)`
  display: flex;
  flex-direction: column;
  align-items: center;

  background-image: url(${meshGradient});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  @media (prefers-color-scheme: dark) {
    background-image: url(${meshGradientDark});
  }

`

const Header = styled(IonHeader)``

const Toolbar = styled(IonToolbar)`
  display: flex;
`

const HeaderRow = styled(IonRow)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const HeaderCol = styled(IonCol)`
  display: flex;
  justify-content: center;
`

const LogoImage = styled.img`
  height: 35px;
`
const NameImage = styled.img`
`

const Avatar = styled(IonAvatar)`
    width:50px !important;
    height: 50px !important;
    border: 1px solid;
    cursor: pointer;
    /* margin-right: 3vw; */
`
const Item = styled(IonItem)`
  /* --border-color: transparent; */
  --background: none;
  background-image: url(${meshGradient});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  @media (prefers-color-scheme: dark) {
    background-image: url(${meshGradientDark});
  }
` 

const Content = styled(IonContent)`

`

/***************** Segment Bar ******************** */

const Segment = styled(IonSegment)`
  /* height: 60px; */
`
const SegmentButton = styled(IonSegmentButton)``
const SegmentLabel = styled(IonLabel)``
/********************************************* */

const NoPostsFound = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1vh;
  /* border: 2px solid blue; */
  width: 100%;
  height: 75vh;
`

const FabButton = styled(IonFabButton)``