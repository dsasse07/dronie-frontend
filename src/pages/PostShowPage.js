import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import { IonToast, IonAlert, IonItem } from '@ionic/react';
import PostCard from '../components/PostCard'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { resetPosts } from '../redux/postsSlice'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStorage } from '@ionic/react-hooks/storage';
import { useHistory } from 'react-router-dom'

function PostShowPage () {
  const currentUser = useSelector(state => state.currentUser)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ networkErrors, setNetworkErrors ] = useState([])
  const [ displayedPost, setDisplayedPost ] = useState({})
  const [ commentToDelete, setCommentToDelete ] = useState(null)
  const [ postToDelete, setPostToDelete ] = useState(null)
  const dispatch = useDispatch()
  const history = useHistory()
  const { get } = useStorage()
  const params = useParams()

  useEffect( () => {
    setIsLoading(true)
    get("token")
    .then( token => {
      fetch(`${process.env.REACT_APP_BACKEND}/posts/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
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
          setIsLoading(false)
          setDisplayedPost({
            ...data,
            images: JSON.parse(data.images),
            user: {
              ...data.user,
              avatar: JSON.parse(data.user.avatar)
            }
          })
        })
        .catch((data) => {
          setNetworkErrors(data.errors);
        });
      })
  }, [params.id] )

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
            setDisplayedPost({
              ...data,
              images: JSON.parse(data.images)
            })
          })
          .catch((data) => {
            console.log(data.errors);
          });
      })
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
            dispatch( resetPosts( [] ) )
            history.push("/home")
          })
          .catch((data) => {
            console.log(data.errors);
          });
      })
  }

  function goToProfile(){
    history.push(`/users/${currentUser.username}`)
  }

  return (
    <IonPage>

    <Header>
        <Toolbar>
          <Title slot="start">Dronie</Title>
          <Item>
            <Avatar slot="end" onClick={goToProfile}>
              <img src={currentUser.avatar.secure_url} alt={currentUser.username}/>
            </Avatar>
          </Item>
        </Toolbar>
      </Header>

      <IonContent fullscreen>
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


        { Object.keys(displayedPost).length > 0 && 
          <PostCard 
            post={displayedPost} 
            onCommentDeleteClick={handleDeleteCommentClick} 
            onPostDeleteClick={handleDeletePostClick}
          />
        }

          
        <Toast
          isOpen={networkErrors.length > 0}
          message={ 
            networkErrors.reduce( (string, error) => {
              return `${string}${error}.\n`
            }, '')
          }
          duration={1500}
          position="middle"
          header="Error :"
          color="danger"
          onDidDismiss={()=> {
            setNetworkErrors([])
            setIsLoading(false)
          }}
          buttons= {[{
            text: 'Done',
            role: 'cancel',
          }]}
        />   
      </IonContent>
    </IonPage>
  );
};

export default PostShowPage;


const Header = styled(IonHeader)``
const Toolbar = styled(IonToolbar)``
const Title = styled(IonTitle)`
  font-size: 1.8rem;
`
const Avatar = styled(IonAvatar)`
    width:50px !important;
    height: 50px;
    border: 1px solid;
    cursor: pointer;
    margin-right: 10px;
`
const Item = styled(IonItem)``


const Toast = styled(IonToast)`
  &::part(message) {
    background-color: green;
  }
`



