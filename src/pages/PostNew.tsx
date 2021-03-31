import './Tab2.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar } from '@ionic/react';
import { IonItem, IonBackButton } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import NewPostForm from '../components/NewPostForm'
import { useHistory } from 'react-router-dom'
import meshGradient from '../assets/meshGradient.png'
import meshGradientDark from '../assets/meshGradientDark.png'
import dronePiece from '../assets/dronePiece.png'
import namePiece from '../assets/namePiece.png'

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
            {/* <Title slot="start">
              Dronie
            </Title> */}
            <LogoImage src={dronePiece} />
            <NameImage src={namePiece} />
            <Avatar slot="end" onClick={goToProfile}>
              <img src={currentUser.avatar.secure_url} alt={currentUser.username}/>
            </Avatar>
          </Item>
        {/* <Toolbar>
          <Item>
            <Title slot="start">
              Dronie
            </Title>
            <Avatar slot="end" onClick={goToProfile}>
              <img src={currentUser.avatar.secure_url} alt={currentUser.username}/>
            </Avatar>
          </Item> */}
        </Toolbar>
      </Header>

      <Content fullscreen>

        <NewPostForm />

      </Content>
    </IonPage>
  );
};

export default PostNew;

const Header = styled(IonHeader)``

const Toolbar = styled(IonToolbar)`
  display: flex;
`

const LogoImage = styled.img`
  height: 35px;
`
const NameImage = styled.img``

const Avatar = styled(IonAvatar)`
    width:50px !important;
    height: 50px !important;
    border: 1px solid;
    cursor: pointer;
    margin-right: 3vw;
`
const Item = styled(IonItem)`
  /* --border-color: transparent; */
  --background: none;
  background-image: url(${meshGradient});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  @media (prefers-color-scheme: dark) {
    background-image: url(${meshGradientDark});
  }
` 
const Content = styled(IonContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: url(${meshGradient});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  @media (prefers-color-scheme: dark) {
    background-image: url(${meshGradientDark});
  }
`