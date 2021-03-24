import './Tab1.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import { IonItem, IonSegment, IonSegmentButton, IonSearchbar, IonLabel } from '@ionic/react';
import { setQuery, setFilter, setResults, clearResults } from '../redux/searchSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

function SearchPage () {

  const currentUser = useSelector(state => state.currentUser)
  const search = useSelector(state => state.search)
  const dispatch = useDispatch()
  const history = useHistory()

  function handleFilterChange(newFilterValue){
      // dispatch( clearPosts([]) )
      // setFeedType(feedType)
  }

  function goToProfile(){
    history.push(`/users/${currentUser.username}`)
  }

  function openUsersPage(username){
    history.push(`/users/${username}`)
  }

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
              value={search.query} 
              onIonChange={e => {
                dispatch( setQuery( (e.detail.value!) ) )
                }
              } 
              animated
              placeholder="Search..."
            >
            </IonSearchbar>


          <Segment 
            value={search.filter}
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
              <SegmentLabel>Location</SegmentLabel>
            </SegmentButton>
          </Segment>

          </Toolbar>
        </Header>













      <IonContent fullscreen>

            Search Page        
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

const Segment = styled(IonSegment)``
const SegmentButton = styled(IonSegmentButton)``
const SegmentLabel = styled(IonLabel)``



