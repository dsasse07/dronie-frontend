import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonCardContent } from '@ionic/react';
import { IonItem, IonCard, IonGrid, IonRow, IonCol, IonToast, IonIcon } from '@ionic/react';
import { IonThumbnail, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { IonPopover, IonList, IonAlert } from '@ionic/react';
import { ellipsisHorizontal, createOutline, logOutOutline, trashOutline } from 'ionicons/icons';
import { useSelector, useDispatch } from 'react-redux'
import { removeCurrentUser } from '../redux/userSlice'
import { setProfileUser, setProfilePosts, updateProfilePosts, resetProfile } from '../redux/profileSlice'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStorage } from '@ionic/react-hooks/storage';
import { useHistory } from 'react-router-dom'
import avatarPlaceHolder from '../assets/avatar.jpg'
import uploadPlaceholder from '../assets/uploadPlaceholder.png'

const ProfilePage = () => {
  const currentUser = useSelector(state => state.currentUser)
  const posts = useSelector(state => state.posts)
  const profilePosts = useSelector(state => state.profile.posts)
  const profileUser = useSelector(state => state.profile.user)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ networkErrors, setNetworkErrors ] = useState([])
  const [ showConfirmAccountDelete, setShowConfirmAccountDelete ] = useState(false)
  const [ popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined
  })
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const { get, remove } = useStorage()
  const params = useParams()

  useEffect( () => {
    setDisableInfiniteScroll(false);
    setIsLoading(true)
    get("token")
    .then( token => {
      fetch(`${process.env.REACT_APP_BACKEND}/users/${params.username}`, {
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
          dispatch( setProfileUser( data) )
          fetchPostPreviews(0, data)
        })
        .catch((data) => {
          if (data.errors) {
            setNetworkErrors(data.errors);
          } else {
            console.log(data)
          }
        });
      })

      return ( () => {
        // setDisableInfiniteScroll(false);
        dispatch( resetProfile() )
      })
  }, [ params.username] )

  console.log(`disable Infinite`, disableInfiniteScroll)

  async function fetchNext(event) {
    console.log('fetch next')
    await fetchPostPreviews();
    (event.target).complete();
  }

  function fetchPostPreviews(startAt, data){
    if (isLoading) return
    const fetchedCount = startAt === 0 ? 0 : profilePosts.length
    setIsLoading(true)
    get("token")
    .then( token => {
      fetch(`${process.env.REACT_APP_BACKEND}/users/${params.username}/posts?fetched_count=${fetchedCount}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then( response => {
          console.log(`response.`, response)
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then((data) => {
              throw data;
            });
          }
        })
        .then((data) => {
          if (data && data.length > 0 ){
            dispatch( setProfilePosts(data) )
            setDisableInfiniteScroll(data.length < 20);
          } else {
            setDisableInfiniteScroll(true);
          }
          setIsLoading(false)
        })
        .catch((data) => {
          setNetworkErrors(data.errors);
        });
      })
  }

  function openPost(postId){
    history.push(`/posts/${postId}`)
  }

  function goToProfile(){
    history.push(`/users/${currentUser.username}`)
  }

  function handleDeleteAccount(password){
    get("token")
    .then( token => {

      const deleteAccountConfig = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify( password)
      }

      fetch(`${process.env.REACT_APP_BACKEND}/users/${currentUser.id}`, deleteAccountConfig)
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
            remove("token")
            .then( () => {
              setShowPopover({ showPopover: false, event: undefined })
              dispatch( removeCurrentUser() ) 
              history.push('/login')
            })
          })
          .catch((data) => {
            setNetworkErrors(data.errors);
          });
      })
  }

  function handleLogOut(){
    remove("token")
      .then( () => {
        setShowPopover({ showPopover: false, event: undefined })
        dispatch( removeCurrentUser() ) 
        history.push('/login')
      })
    
  }

  function handleEditClick(){
    setShowPopover({ showPopover: false, event: undefined })
    history.push('/edit-profile')
  }

  const postPreviews = profilePosts.length > 0 && profilePosts.map( post => {
    return (
      <GalleryThumbnail key={post.id} post={post} onClick={ () => openPost(post.id) }>
        <img src={post.images[0].secure_url} alt={post.description}/>
      </GalleryThumbnail>
    )
  })

  return (
    <IonPage>

        <Header >
          <Toolbar>
            <Title slot="start">Dronie</Title>
            <Item>
              <Avatar slot="end" onClick={goToProfile}>
                <img src={currentUser.avatar.secure_url}/>
              </Avatar>
            </Item>
          </Toolbar>
        </Header>

      <IonContent fullscreen>
        <Card>
          { profileUser?.id === currentUser.id && 
            <MenuButton onClick={ (e) => {
                    e.persist();
                    setShowPopover({ showPopover: true, event: e })
                  }}
            >
              <IonIcon icon={ellipsisHorizontal} />
            </MenuButton>
          }

          <IonCardContent>
            <Grid>

              <Row>
                <Col>
                  <ImageContainer>
                    <img 
                      src={profileUser?.avatar ? profileUser?.avatar.secure_url : avatarPlaceHolder }
                      alt={profileUser?.username}
                    />
                  </ImageContainer>
                </Col>

                <Col>
                  <UserDetailsGrid>
                    <IonRow>
                      <IonCol>
                        <IonItem>
                          <strong>{profileUser?.username}</strong>
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol>
                        { (profileUser?.first_name || profileUser?.last_name) && 
                          <NameItem>
                            <IonLabel text-wrap>
                              {`${profileUser?.first_name} ${profileUser?.last_name}`}
                            </IonLabel>
                          </NameItem>
                        }
                      </IonCol>
                    </IonRow>

                  </UserDetailsGrid>
                </Col>
              </Row>

              <BioRow>
                <IonCol>
                  <BioContainer>
                    <strong>Bio: </strong>
                    {profileUser?.bio}
                    addition to calling toggleDarkTheme when the app loads and when the media query changes, the toggleDa
                  </BioContainer>
                </IonCol>
              </BioRow>

              <GalleryRow>
                <IonCol>
                  <GalleryContainer>
                    {postPreviews}
                    { !postPreviews &&
                      <IonItem>
                        <IonLabel>
                          No posts yet.
                        </IonLabel>
                      </IonItem>
                    }
                  </GalleryContainer>
                </IonCol>
              </GalleryRow>

              <IonInfiniteScroll 
                threshold="30%" 
                disabled={disableInfiniteScroll}
                onIonInfinite={fetchNext}
              >

                <IonInfiniteScrollContent
                  loadingText="Loading Posts...">
                </IonInfiniteScrollContent>
              </IonInfiniteScroll>

            </Grid>
          </IonCardContent>
        </Card>

        <IonPopover
          cssClass='my-custom-class'
          event={popoverState.event}
          isOpen={popoverState.showPopover}
          onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
        >
          <IonList>
            <EditProfileItem onClick={handleEditClick}>
              <IonIcon icon={createOutline} slot="start"/>
              <IonLabel>Edit Profile</IonLabel>
            </EditProfileItem>
            <LogOutItem onClick={handleLogOut}>
              <IonIcon icon={logOutOutline} slot="start"/>
              <IonLabel >Logout</IonLabel>
            </LogOutItem>
            <DeleteProfileItem onClick={ () => setShowConfirmAccountDelete(true) } >
              <IonIcon icon={trashOutline} slot="start" />
              <IonLabel color="danger" >Delete Account</IonLabel>
            </DeleteProfileItem>
          </IonList>
        </IonPopover>

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

        <DeleteAccountConfirm
          isOpen={showConfirmAccountDelete}
          onDidDismiss={() => setShowConfirmAccountDelete(false) }
          cssClass='my-custom-class'
          header={'Confirm Delete'}
          message={'Are you sure you wish to delete your account? Type your password to confirm'}
          inputs={[
            {
              name: 'password',
              type: 'password',
              placeholder: 'Current Password'
            }
          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Delete',
              role: 'delete',
              color: "danger",
              handler: (e) => {
                handleDeleteAccount(e)
              }
            }
          ]}
        />

      </IonContent>
      

    </IonPage>
  );
};

export default ProfilePage;

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

const Card = styled(IonCard)`
  position: relative;
  display: grid;
  align-items: center;
  justify-content: center;
  max-width: 95%;
  height: 97%;
`
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
/************************************ */

const Grid = styled(IonGrid)``
const Row = styled(IonRow)``
const Col = styled(IonCol)``

const Toast = styled(IonToast)`
  &::part(message) {
    background-color: green;
  }
`

/************************************ */

const ImageContainer = styled.div`
  height: 25vw;
  width: 25vw;
  max-width: 250px;
  max-height: 250px;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

/************************************** */

const UserDetailsGrid = styled(IonGrid)`
  width: 53vw;
`

const BioRow = styled(IonRow)`
  height: 150px;
  overflow-y: scroll;
  
`
const BioContainer = styled.div`
    overflow-y: scroll;
    height: 100%;
`

const NameItem = styled(IonItem)``

const GalleryRow = styled(IonRow)`
  height: 40vh;
  overflow-y: scroll;

`

const GalleryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
`

const GalleryThumbnail = styled(IonThumbnail)`
  height: 25vw;
  width: 25vw;
  max-width: 250px;
  max-height: 250px;
  overflow: hidden;
  border: 2px solid;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

/******************************************/

const DeleteProfileItem = styled(IonItem)`
  margin-top: 100px;
  cursor: pointer;
`

const LogOutItem = styled(IonItem)`
  margin-top: 15px;
  cursor: pointer;
`

const EditProfileItem = styled(IonItem)`
  cursor: pointer;
`

const DeleteAccountConfirm = styled(IonAlert)``