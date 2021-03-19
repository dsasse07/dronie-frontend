import './Tab1.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonList } from '@ionic/react';
import { IonItem } from '@ionic/react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import PostCard from '../components/PostCard'

function Home () {

  const currentUser = useSelector(state => state.currentUser)
  const posts = useSelector(state => state.posts)
  const postComponents = posts.map( (post, index) => <PostCard key={index} post={post} /> )

  return (
    <IonPage>
        <Header >
          <Toolbar>
            <Title slot="start">Dronie</Title>
            <Item>
              <Avatar slot="end">
                <img src={currentUser.avatar}/>
              </Avatar>
            </Item>
          </Toolbar>
        </Header>


      <IonContent fullscreen >
      
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
    width:50px !important;
    height: auto !important;
    border: 1px solid;
    cursor: pointer;
`

const Item = styled(IonItem)``