import './Tab1.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonList } from '@ionic/react';
import { IonItem } from '@ionic/react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import PostCard from '../components/PostCard'

function Home () {

  const user = useSelector(state => state.user)
  const posts = useSelector(state => state.posts)
  const postComponents = posts.map( (post, index) => <PostCard key={index} post={post} /> )

  return (
    <IonPage>
        <Header >
          <Toolbar>
            <Title slot="start">Dronie</Title>
            <Item>
              <Avatar slot="end">
                <img src={user.picture.thumbnail}/>
              </Avatar>
            </Item>
          </Toolbar>
        </Header>


      <IonContent fullscreen class="ion-justify-IonContent-center">
      
        <List>
          {postComponents}
        </List>

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
  /* padding: 4px; */
  border: 1px solid;
  cursor: pointer;
`

const Item = styled(IonItem)`

`