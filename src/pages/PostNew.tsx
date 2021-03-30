import './Tab2.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import { IonItem, IonBackButton } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import NewPostForm from '../components/NewPostForm'
import { useHistory } from 'react-router-dom'
const PostNew: React.FC = () => {
  const currentUser = useSelector(state => state.currentUser)
  const history = useHistory()
  
  function goToProfile(){
    history.push(`/users/${currentUser.username}`)
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

