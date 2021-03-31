import './Tab1.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import { IonItem, IonSegment, IonSegmentButton, IonSearchbar, IonLabel } from '@ionic/react';
import { IonGrid, IonRow, IonCol, IonThumbnail, IonImg, IonInfiniteScroll } from '@ionic/react';
import { IonInfiniteScrollContent, IonIcon, IonBackButton, IonLoading } from '@ionic/react';
import { peopleOutline, imagesOutline, pricetagsOutline, locationOutline } from 'ionicons/icons';
import { setQuery, setFilter, setUserResults, setPostResults, clearResults } from '../redux/searchSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styled from 'styled-components'

function SearchPage () {
  // const posts = useSelector(state => state.posts)
  const { filter, query, results } = useSelector(state => state.search)
  const currentUser = useSelector(state => state.currentUser)
  const [ isFetching, setIsFetching ] = useState(false)
  const [ searchSubmitted, setSearchSubmitted ] = useState(false)
  const [ disableInfiniteScroll , setDisableInfiniteScroll ] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  function handleFilterChange(newFilterValue){
    setDisableInfiniteScroll(false)
    dispatch( setFilter( newFilterValue ) )
  }

  useEffect( () => {
    if ( query === "" || results[filter].length > 0 ) return
    fetchResults()
    
    return( () => {
      setSearchSubmitted(false)
    })
  }, [filter])

function handleSearchSubmit(e){
    if (e.key !== "Enter" || query === "") return
    dispatch( clearResults([]) )
    fetchResults()
    setSearchSubmitted(true)
  }

  function fetchResults(){
    const urlParams = `/search?filter=${filter}&q=${query}&fetched=${results[filter].length}`
    setIsFetching(true)
    fetch(`${process.env.REACT_APP_BACKEND}${urlParams}`)
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
          (filter === "users") ? dispatch( setUserResults(data) ) : dispatch( setPostResults(data) )
          setDisableInfiniteScroll(data.length < 20);
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
    await fetchResults();
    (event.target).complete();
  }

  function goToProfile(){
    history.push(`/users/${currentUser.username}`)
  }

  function openUsersPage(username){
    history.push(`/users/${username}`)
  }

  function openPost(postId){
    history.push(`/posts/${postId}`)
  }

  function postResultComponents(){
    return results[filter]?.map( post => {
      return (
          <ResultPreview key={post.id} post={post} onClick={ () => openPost(post.id) }>
            <img src={post.images[0].secure_url} alt={post.description}/>
          </ResultPreview>
      )
    })
  }

  function userResultComponents(){
    return results.users?.map( user => {
      return (
          <ResultPreview key={user.id} user={user} onClick={ () => openUsersPage(user.username) }>
            <img src={user.avatar.secure_url} alt={user.username}/>
            <span>{user.username}</span>
          </ResultPreview>
      )
    })
  }
  
  const displayedComponents = filter === "users" ? userResultComponents() : postResultComponents()

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

            <IonSearchbar 
              value={query} 
              onIonChange={e => {
                dispatch( setQuery( (e.detail.value!) ) )
                }
              } 
              onKeyUp={handleSearchSubmit}
              animated
              showClearButton="always"
              placeholder="Search..."
            >
            </IonSearchbar>


          <Segment 
            value={filter}
            onIonChange={e => handleFilterChange(e.detail.value) }
          >
            <SegmentButton value="users">
              <SegmentLabel>Users</SegmentLabel>
            </SegmentButton>
            <SegmentButton value="description">
              <SegmentLabel>Description</SegmentLabel>
            </SegmentButton>
            <SegmentButton value="tags">
              <SegmentLabel>Tags</SegmentLabel>
            </SegmentButton>
            <SegmentButton value="location">
              <SegmentLabel>
                Location
              </SegmentLabel>
            </SegmentButton>
          </Segment>

          </Toolbar>
        </Header>

      <IonContent >
        <IonLoading
          isOpen={isFetching}
          message={'Searching...'}
        />

        { displayedComponents?.length > 0 &&
          <ResultsGrid>
            {displayedComponents}
          </ResultsGrid>
        }
        { displayedComponents?.length === 0 && searchSubmitted &&
          <NoMatches>  
            No Matches Found
          </NoMatches>
        }
        

            
        <IonInfiniteScroll 
          threshold="20%" 
          disabled={disableInfiniteScroll}
          onIonInfinite={fetchNext}
        >
          <IonInfiniteScrollContent
            loadingText="Fetching more results">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>

      </IonContent>

    </IonPage>
  );
};

export default SearchPage;


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

const Segment = styled(IonSegment)`
`
const SegmentButton = styled(IonSegmentButton)``
const SegmentLabel = styled(IonLabel)``

/***************** Results grid ******************* */

const ResultsGrid = styled(IonGrid)`
  display: flex;
  flex-wrap: wrap;
  gap: 1vw;
  justify-content: center;
  overflow-y: scroll;
  margin-top:10px;
  border: 1px solid blue;
  height: 98.5%;
`
const ResultPreview = styled.div`
  position: relative;
  max-width: 30vw;
  max-height: 30vw;
  cursor: pointer;
  transition: .2s ease-in-out; 

  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  span{
    background: rgba(51, 51, 51, 0.6); 
    align-items: center;
    bottom: 0;
    color: white;
    display: flex;
    justify-content: center;
    left: 0;
    margin-bottom: 10%;
    overflow: hidden;
    position: absolute;
    width: 100%;
  }

  :hover{
    transform: scale(1.05)
  }
`

const NoMatches = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`