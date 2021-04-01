import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import { IonToast, IonAlert, IonItem, IonLoading, IonRow, IonCol } from '@ionic/react';
import PostCard from '../components/PostCard'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { removePost, updatePost } from '../redux/postsSlice'
import { deleteProfilePost } from '../redux/profileSlice'
import { useEffect, useState } from 'react'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { useStorage } from '@ionic/react-hooks/storage';
import meshGradient from '../assets/meshGradient.png'
import meshGradientDark from '../assets/meshGradientDark.png'
import dronePiece from '../assets/dronePiece.png'
import namePiece from '../assets/namePiece.png'

function PostShowPage () {
  const currentUser = useSelector(state => state.currentUser)
  const posts = useSelector(state => state.posts)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ networkErrors, setNetworkErrors ] = useState([])
  const [ displayedPost, setDisplayedPost ] = useState({})
  const [ commentToDelete, setCommentToDelete ] = useState(null)
  const [ postToDelete, setPostToDelete ] = useState(null)
  const [ postToEdit, setPostToEdit ] = useState(null)
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams()
  const match = useRouteMatch()
  const { get } = useStorage()

  useEffect( () => {
    console.log(`match.url`, match.url)
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
          setIsLoading(false)
        });
      })

  }, [params.id, posts] )

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
            console.log(data.errors);
          });
      })
  }


  function handleDeletePostClick(postId){
    setPostToDelete(postId)
  }

  function handleDeletePost(postId){
    setIsLoading(true)
    dispatch( deleteProfilePost(postId) )
    dispatch( removePost(postId) )
    goToProfile()

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
            // Optimistically Removes post from state to 
            // prevent 404 error on component re-render
            setIsLoading(false)
          })
          .catch((data) => {
            console.log(data)
            console.log(data.errors);  
            setIsLoading(false)
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

  function goToProfile(){
    history.push(`/users/${currentUser.username}`)
  }

  return (
    <IonPage>

    <Header>
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
        {/* <Toolbar>
          <Item>
            <Title slot="start">Dronie</Title>
            <Avatar slot="end" onClick={goToProfile}>
              <img src={currentUser.avatar.secure_url} alt={currentUser.username}/>
            </Avatar>
          </Item> */}
        </Toolbar>
      </Header>

      <Content fullscreen>
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

        <IonLoading
          isOpen={isLoading}
          message={'Loading...'}
        />

        { Object.keys(displayedPost).length > 0 && 
          <Container>
            <PostCard 
              post={displayedPost} 
              onCommentDeleteClick={handleDeleteCommentClick} 
              onPostDeleteClick={handleDeletePostClick}
              onEditPostClick={handleEditPostClick}
            />
          </Container>
        }

          
        <Toast
          isOpen={networkErrors?.length > 0}
          message={ 
            networkErrors?.reduce( (string, error) => {
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
      </Content>
    </IonPage>
  );
};

export default PostShowPage;


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
const NameImage = styled.img``

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
  --background: none;
  background-image: url(${meshGradient});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  @media (prefers-color-scheme: dark) {
    background-image: url(${meshGradientDark});
  }
`

const Toast = styled(IonToast)`
  &::part(message) {
    background-color: green;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: url(${meshGradient});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  @media (prefers-color-scheme: dark) {
    background-image: url(${meshGradientDark});
  }

`

