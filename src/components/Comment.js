import React from 'react'
import { IonItem, IonButton, IonIcon, IonText } from '@ionic/react'
import styled from 'styled-components'
import { trashOutline } from 'ionicons/icons';
import { useStorage } from '@ionic/react-hooks/storage'
import { useDispatch, useSelector } from 'react-redux'
import { updatePost } from '../redux/postsSlice'

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
    <Item>
      <p><strong> {author} </strong></p>
      {content}
      <IonButton slot="end" color="danger" onClick={handleDeleteComment}>
        <IonIcon icon={trashOutline} />
      </IonButton>
    </Item>
  )
}

export default Comment

const Item = styled(IonItem)`
&& {
    font-size: 0.9rem;
    width: 300px;
    ion-label{
      margin: 0;
      padding: 0;
    }
    --min-height: 40px;
  }
  :last-of-type{
    --border-color: transparent;
  }
  strong {
    padding-right: 0.3rem;
    word-wrap: break-word;
  }
`