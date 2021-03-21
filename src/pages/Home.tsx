import './Tab1.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import {IonInfiniteScroll, IonInfiniteScrollContent, IonAvatar, IonList } from '@ionic/react';
import { IonItem } from '@ionic/react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import PostCard from '../components/PostCard'
import { useEffect, useState } from 'react'
import { setPosts } from '../redux/postsSlice'

function Home () {
  const currentUser = useSelector(state => state.currentUser)
  const posts = useSelector(state => state.posts)
  const dispatch = useDispatch()
  const postComponents = posts.map( post => <PostCard key={post.id} post={post} />  )
  const [ isFetching, setIsFetching ] = useState(false)
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState(false)

  useEffect( () => {
    fetchPosts()
  }, [])

  function fetchPosts(){
    if (isFetching) return
    setIsFetching(true)

    fetch(`${process.env.REACT_APP_BACKEND}/posts?fetched_count=${posts.length}`)
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
          setDisableInfiniteScroll(data.length < 10);
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
    await fetchPosts();
    (event.target).complete();
  }

  return (
    <IonPage>
        <Header >
          <Toolbar>
            <Title slot="start">Dronie</Title>
            <Item>
              <Avatar slot="end">
                <img src={currentUser.avatar.secure_url} alt={currentUser.username}/>
              </Avatar>
            </Item>
          </Toolbar>
        </Header>

      <IonContent fullscreen >
      
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

const Item = styled(IonItem)``