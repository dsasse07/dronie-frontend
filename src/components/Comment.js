import { IonGrid, IonRow, IonCol, IonLabel, IonIcon } from '@ionic/react'
import { ellipsisHorizontal } from 'ionicons/icons';
import { useStorage } from '@ionic/react-hooks/storage'
import { useDispatch, useSelector } from 'react-redux'
import { updatePost } from '../redux/postsSlice'
import styled from 'styled-components'

function Comment( { comment, showComments, post } ) {
  const { id, content, author, created_at } = comment
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const { get } = useStorage()

  function belongsToCurrentUser(){
    return currentUser.comments.filter( comment => {
      return comment.id === id
    }).length > 0
  }

  function handleDeleteComment(){
    get("token")
    .then( token => {

      const deleteCommentConfig = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }

      fetch(`${process.env.REACT_APP_BACKEND}/comments/${post.id}`, deleteCommentConfig)
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
            dispatch( updatePost( data ) )
          })
          .catch((data) => {
            console.log(data.errors);
          });
      })
  }


  return (

    <Grid>
      <Row>
        <IonLabel>

          <IonCol>
            <AuthorSpan> 
              {author} 
            </AuthorSpan>
            <DateSpan>
              {new Date(created_at).toDateString().slice(4) }
            </DateSpan>
          </IonCol>

          <IonCol>
            <DeleteButton icon={ellipsisHorizontal} onClick={handleDeleteComment} />
          </IonCol>

        </IonLabel>
      </Row>

      <IonRow>
        <IonCol>
          <IonLabel text-wrap>
            {content}
          </IonLabel>
        </IonCol>
      </IonRow>
      <hr/>
    </Grid>
  )
}

export default Comment

const Grid = styled(IonGrid)`
  /* border-bottom: 1px solid; */
  hr {
    margin-top: 0.6rem;
  }
`

const Row = styled(IonRow)`
  ion-label{
    width: 100%;
    display: flex;
    justify-content: space-between;

    span{
      display: flex;
      align-items: center;
    }
    ion-col{
      display: flex;
      :first-of-type{
        align-items: flex-end;
      }
      :last-of-type{
        justify-content: flex-end;
        padding-right: 2rem;
        ion-icon{
          font-size: 1.2rem;
        }
      }
    }
  }
`

const DateSpan = styled.span`
  font-size: 0.8rem;
`

const AuthorSpan = styled.span`
  font-weight: bold;
  font-size: 1rem;
  padding-right: 0.5rem;
`

const DeleteButton = styled(IonIcon)`
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  padding-left: 1rem;
`