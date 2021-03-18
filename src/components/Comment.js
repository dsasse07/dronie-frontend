import React from 'react'
import { IonItem } from '@ionic/react'
import styled from 'styled-components'

function Comment( { comment, showComments } ) {
  return (
    <Item>
      <strong> {comment.username} </strong>
      {comment.content}
    </Item>
  )
}

export default Comment

const Item = styled(IonItem)`
&& {
    font-size: 0.9rem;
    
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
  }
`