import './Tab2.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import { IonItem } from '@ionic/react';
import {  } from 'ionicons/icons';
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import NewPostForm from '../components/NewPostForm'

const PostNew: React.FC = () => {
  const currentUser = useSelector(state => state.currentUser)


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

        <NewPostForm />

      </IonContent>
    </IonPage>
  );
};

export default PostNew;

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