import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonCardContent } from '@ionic/react';
import { IonItem, IonCard, IonGrid, IonRow, IonCol, IonToast, IonIcon } from '@ionic/react';
import { IonThumbnail, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { IonPopover, IonList, IonAlert, IonButton, IonLoading, useIonViewWillLeave } from '@ionic/react';
import { ellipsisHorizontal, createOutline, logOutOutline, trashOutline, close } from 'ionicons/icons';
import { checkmark, add, mailOutline } from 'ionicons/icons';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentUser, removeCurrentUser } from '../redux/userSlice'
import { setProfileUser, setProfilePosts, updateProfileUser, resetProfile } from '../redux/profileSlice'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStorage } from '@ionic/react-hooks/storage';
import { useHistory } from 'react-router-dom'
import avatarPlaceHolder from '../assets/avatar.jpg'
import { setChatWith } from '../redux/chatWithSlice';

const ProfilePage = ({chatSubscription, setChatSubscription}) => {
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
  const [ showFollowPopover, setShowFollowPopover ] = useState ({
    showPopover: false,
    users: undefined,
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
          dispatch( setProfileUser( data) )
          setIsLoading(false)
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
        dispatch( resetProfile({
            user: null,
            posts: []
          }
        ))
      })
  }, [ params.username] )

  // useIonViewWillLeave( () => {
  //   dispatch( resetProfile({
  //     user: null,
  //     posts: []
  //   }
  // ))
  // })

  async function fetchNext(event) {
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
          if (data && data.length > 0 ){
            dispatch( setProfilePosts(data) )
            setDisableInfiniteScroll(data.length < 15);
          } else {
            setDisableInfiniteScroll(true);
          }
        })
        .catch((data) => {
          setNetworkErrors(data.errors);
        });
      })
  }

  function followedByCurrentUser(){
    if (!profileUser) return
    return currentUser.following.filter( otherUser => {
      return otherUser.id === profileUser.id
    }).length > 0
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
    chatSubscription.unsubscribe()
    setChatSubscription(null)
    remove("token")
      .then( () => {
        setShowPopover({ showPopover: false, event: undefined })
        dispatch( removeCurrentUser() ) 
        // history.push('/login')
      })
  }

  function handleEditClick(){
    setShowPopover({ showPopover: false, event: undefined })
    history.push('/edit-profile')
  }

  function handleFollowToggle(){
    get("token")
      .then( token => { 
        let route
        const followConfig = {
          headers: {
            "Content-type":"application/json",
            Authorization: `Bearer ${token}`
          }
        }

        if (followedByCurrentUser()) {
          followConfig.method = "DELETE"
          route = `/follows/${profileUser.id}`
        } else {
          followConfig.method = "POST"
          followConfig.body = JSON.stringify( {following_id: profileUser.id} )
          route = `/follows`
        } 
        
        fetch(`${process.env.REACT_APP_BACKEND}${route}`, followConfig)
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
            dispatch( setProfileUser( data.followed_user ) )
            dispatch( setCurrentUser( data.user ) )
          })
          .catch((data) => {
            console.log(data.errors);
          });
      })
  }

  function loadProfile( user ){
    setShowFollowPopover({ 
      showPopover: false, 
      users: undefined, 
      event: undefined 
    })
    history.push(`/users/${user.username}`)
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
            <Item>
              <Title slot="start">Dronie</Title>
              <Avatar slot="end" onClick={goToProfile}>
                <img src={currentUser.avatar.secure_url}/>
              </Avatar>
            </Item>
          </Toolbar>
        </Header>

      <IonContent fullscreen>
        <IonLoading
          isOpen={isLoading}
          message={'Loading...'}
        />
        <Container>
          <Card>

            <IonCardContent>
              <Grid>

                <Row>
                  <Col>
                    <Row>
                      <ImageContainer>
                        <img 
                          src={profileUser?.avatar ? profileUser?.avatar.secure_url : avatarPlaceHolder }
                          alt={profileUser?.username}
                        />
                      </ImageContainer>
                    </Row>

                    <IonRow>
                      <FullNameCol>
                        { (profileUser?.first_name || profileUser?.last_name) && 
                          <FullNameLabel text-wrap>
                            {`${profileUser?.first_name} ${profileUser?.last_name}`}
                          </FullNameLabel>
                        }
                      </FullNameCol>
                    </IonRow>

                  </Col>

                  <Col>
                    <UserDetailsGrid>

                      <UserDetailsRow1>  
                        <IonCol>
                          <UsernameLabel>
                            <strong>{profileUser?.username}</strong>
                          </UsernameLabel>
                        </IonCol>

                        { profileUser?.id === currentUser.id && 
                          <IonCol>
                              <MenuButton onClick={ (e) => {
                                      e.persist();
                                      setShowPopover({ showPopover: true, event: e })
                                    }}
                              >
                                <IonIcon icon={ellipsisHorizontal} />
                              </MenuButton>
                          </IonCol>
                        }
                      </UserDetailsRow1>

                      <UserDetailsRow2>
                        <IonCol onClick={ (e) => {
                                      if (profileUser?.followers.length === 0) return
                                      e.persist();
                                      setShowFollowPopover({ 
                                        showPopover: true, 
                                        users: profileUser.followers, 
                                        event: e })
                                    }}
                        >
                          <IonRow>
                            <strong>{profileUser?.followers.length}</strong>
                          </IonRow>
                          <IonRow>
                            <FullNameLabel text-wrap>
                              Followers
                            </FullNameLabel>
                          </IonRow>
                        </IonCol>
                        <IonCol onClick={ (e) => {
                                      if (profileUser?.following.length === 0) return
                                      e.persist();
                                      setShowFollowPopover({ 
                                        showPopover: true,
                                        users: profileUser.following, 
                                        event: e })
                                    }}
                        >
                          <IonRow>
                            <strong>{profileUser?.following.length}</strong>
                          </IonRow>
                          <IonRow>
                            <FullNameLabel text-wrap>
                              Following
                            </FullNameLabel>
                          </IonRow>
                        </IonCol>
                      </UserDetailsRow2>
                      
                      { profileUser?.id !== currentUser.id && 
                        <UserDetailsRow3>
                          <IonCol>
                            <FollowButton size="small" onClick={handleFollowToggle}>
                              { followedByCurrentUser() ? 
                                <>
                                  <IonLabel>
                                    Following 
                                  </IonLabel>
                                  <IonIcon slot="end" icon={checkmark}/> 
                                </>
                              : 
                                <>
                                  <IonLabel>
                                    Follow
                                  </IonLabel>
                                  <IonIcon slot="end" icon={add} />
                                </>
                              }
                            </FollowButton>
                          </IonCol>
                          <IonCol>
                            <MessageButton size="small" color="secondary" routerLink="/contacts" onClick={() => { dispatch( setChatWith(profileUser.username)) } }>
                              <IonIcon icon={mailOutline} />
                            </MessageButton>
                          </IonCol>
                        </UserDetailsRow3>
                      }

                    </UserDetailsGrid>
                  </Col>
                </Row>

                <BioRow>
                  <IonCol>
                    <BioContainer>
                      {profileUser?.bio}
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
              
                    <IonInfiniteScroll 
                      threshold="15%" 
                      disabled={disableInfiniteScroll}
                      onIonInfinite={fetchNext}
                    >

                      <IonInfiniteScrollContent
                        loadingText="Loading Posts...">
                      </IonInfiniteScrollContent>
                    </IonInfiniteScroll>
                  </IonCol>
                </GalleryRow>

            

              </Grid>
            </IonCardContent>
          </Card>
        </Container>

        <MenuPopover
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
        </MenuPopover>

        <FollowPopover
          cssClass='my-custom-class'
          event={showFollowPopover.event}
          isOpen={showFollowPopover.showPopover}
          onDidDismiss={() => {
              setShowFollowPopover({ 
                showPopover: false, 
                users: undefined, 
                event: undefined 
              })
            }}
        >
          <FollowList>
            { showFollowPopover.users?.map( user => {
              return (
                <UserItem key={user.id} onClick={ () => loadProfile(user) }>
                  <UserAvatarPreview slot="start">
                    <img src={ user.avatar ? JSON.parse(user.avatar)[0].secure_url : avatarPlaceHolder } />
                  </UserAvatarPreview>
                  <UserLabel>
                    {user.username}
                  </UserLabel>
                </UserItem>
              )
            })
          }
          </FollowList>
        </FollowPopover>

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


const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  

`

const Card = styled(IonCard)`
  position: relative;
  display: grid;
  align-items: center;
  justify-content: center;
  max-width: 95%;
  height: 97%;
  @media (min-width: 900px) {
    max-width: 950px;
  }
  
`
const MenuButton = styled(IonButton)`
  cursor: pointer;
  font-size:1rem;
  padding: 5px;

  ion-icon {
    cursor: pointer;
  }
`
/************************************ */

const Grid = styled(IonGrid)``
const Row = styled(IonRow)`
  display: flex;
  align-items: center;
  justify-content: center;
`
const Col = styled(IonCol)``

const Toast = styled(IonToast)`
  &::part(message) {
    background-color: green;
  }
`

/************************************ */

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20vw;
  width: 20vw;
  max-width: 200px;
  max-height: 200px;
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
  height: 13vh;
  overflow-y: scroll;
  /* border: 1px solid; */
`

// const BioRow = styled(IonRow)``
const BioContainer = styled(IonCol)`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
  height: 100%;
`

const UsernameLabel = styled(IonLabel)`
  font-size: 1rem;
  line-height: 1rem;
`

const FullNameCol = styled(IonCol)`
  display: flex;
  align-items: center;
  justify-content: center;
`
const FullNameLabel = styled(IonLabel)`
  font-size: 0.8rem;
  line-height: 1rem;
`

const UserDetailsRow1 = styled(IonRow)`
  ion-col {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const UserDetailsRow2 = styled(IonRow)`
  ion-row {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  strong, ion-label {
    cursor: pointer;
  }
`

const UserDetailsRow3 = styled(IonRow)`
  ion-col{
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
const FollowButton = styled(IonButton)``
const MessageButton = styled(IonButton)``

const GalleryRow = styled(IonRow)`
  height: 41vh;
  overflow-y: scroll;
  margin-top: 15px;
  margin-bottom: 15px;
  /* border: 1px solid; */
`

const GalleryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`

const GalleryThumbnail = styled(IonThumbnail)`
  height: 25vw;
  width: 25vw;
  max-width: 250px;
  max-height: 250px;
  overflow: hidden;
  border: 2px solid;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

/******************************************/
const MenuPopover = styled(IonPopover)``

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

/******************************************/
const FollowPopover = styled(IonPopover)``
const FollowList = styled(IonList)``
const UserItem = styled(IonItem)``
const UserAvatarPreview = styled(IonAvatar)``
const UserLabel = styled(IonLabel)``