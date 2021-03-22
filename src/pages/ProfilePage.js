import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonCardContent } from '@ionic/react';
import { IonItem, IonCard, IonGrid, IonRow, IonCol, IonToast } from '@ionic/react';
import { IonThumbnail, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import {  } from 'ionicons/icons';
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStorage } from '@ionic/react-hooks/storage';
import avatarPlaceHolder from '../assets/avatar.jpg'
import uploadPlaceholder from '../assets/uploadPlaceholder.png'

const ProfilePage = () => {
  const currentUser = useSelector(state => state.currentUser)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ networkErrors, setNetworkErrors ] = useState([])
  const [ displayedUser, setDisplayedUser ] = useState({})
  const [ displayedPosts, setDisplayedPosts ] = useState([])
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState(false)
  const { get } = useStorage()
  const params = useParams()

  useEffect( () => {
    // if (params.username === currentUser.username) {
    //   setDisplayedUser(currentUser)
    //   return 
    // }
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
          setDisplayedUser({
            ...data,
            avatar: JSON.parse(data.avatar)[0],
          })
        })
        .catch((data) => {
          setNetworkErrors(data.errors);
        });
      })
  }, [] )

  useEffect ( () => {
    fetchPostPreviews()
  }, [displayedUser])

  async function fetchNext(event) {
    await fetchPostPreviews();
    (event.target).complete();
  }

  function fetchPostPreviews(){
    if ( Object.keys(displayedUser).length == 0 ) return
    if (isLoading) return
    setIsLoading(true)
    get("token")
    .then( token => {
      fetch(`${process.env.REACT_APP_BACKEND}/users/${displayedUser.id}/posts?fetched_count=${displayedPosts.length}`, {
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
          if (data && data.length > 0 ){
            setDisplayedPosts([ ...displayedPosts, ...data.map( post => {
                return {
                  ...post,
                  images: JSON.parse(post.images)
                }
            })
            ])
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

  const postPreviews = displayedPosts && displayedPosts.map( post => {
    return (
      <GalleryThumbnail key={post.id} post={post} >
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
              <Avatar slot="end">
                <img src={currentUser.avatar.secure_url}/>
              </Avatar>
            </Item>
          </Toolbar>
        </Header>

      <IonContent fullscreen>
        <Card>
          <IonCardContent>
            <Grid>

              <Row>
                <Col>
                  <ImageContainer>
                    <img 
                      src={displayedUser.avatar ? displayedUser.avatar.secure_url : avatarPlaceHolder }
                      alt={displayedUser.username}
                    />
                  </ImageContainer>
                </Col>

                <Col>
                  <UserDetailsGrid>
                    <IonRow>
                      <IonCol>
                        <IonItem>
                          {displayedUser.username}
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol>
                        { (displayedUser.first_name || displayedUser.last_name) && 
                          <IonItem>
                            <IonLabel text-wrap>
                              (`${displayedUser.first_name} ${displayedUser.last_name}`)
                            </IonLabel>
                          </IonItem>
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
                    {displayedUser.bio}
                    addition to calling toggleDarkTheme when the app loads and when the media query changes, the toggleDa
                  </BioContainer>
                </IonCol>
              </BioRow>

              <GalleryRow>
                <IonCol>
                  <GalleryContainer>
                    {postPreviews}
                  </GalleryContainer>
                </IonCol>
              </GalleryRow>

              <IonInfiniteScroll 
                threshold="200px" 
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
  display: grid;
  align-items: center;
  justify-content: center;
  max-width: 95%;
  height: 97%;
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