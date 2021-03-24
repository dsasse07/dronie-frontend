import { useState } from 'react'
import styled from 'styled-components'
import { close } from 'ionicons/icons'
import { IonInput, IonLabel, IonItem, IonIcon, IonPopover, IonList } from "@ionic/react"
import { IonRow, IonCol, IonNote } from "@ionic/react"
import { useDispatch, useSelector } from 'react-redux'
import { addPostTag, removePostTag } from '../redux/postFormSlice'

function TagInput() {
  const postForm = useSelector(state => state.postForm)
  const tags = useSelector(state => state.tags)
  const [ inputText, setInputText ] = useState("")
  const dispatch = useDispatch()
  const [ showPopover, setShowPopover] = useState({
    showPopover: false,
    event: undefined
  })

  const addTags = event => {
    setInputText(event.target.value)
    if ( event.key === "Enter" && event.target.value !== "") {
      dispatch( addPostTag( inputText.trim() ) )
      event.target.value = "";
    }
  };

  const removeTag = tag => {
    dispatch( removePostTag( tag ) )
  };

  const tagComponents = postForm.tags?.map( (tag, index) => {
    return (
      <TagItem key={index} >
          <IonLabel>{tag}</IonLabel>
          <IonIcon slot="end" src={close} onClick={() => removeTag(tag)} />
      </TagItem>
    )
  })

  const unusedTags = tags.filter(tag => {
    console.log(`testing`, tag, !postForm.tags.find( postTag => postTag === tag.name))
    return !postForm.tags.find( postTag => postTag === tag.name)
  })

  const filteredTags = unusedTags.filter( tag => {
    return tag.name.includes(inputText) &&
      postForm.tags.filter(tag => {})
  })

  const suggestionComponents = filteredTags.map( (tag, index) => {
    return (
      <TagItem key={index} onClick={ () => handleAddTag(tag.name) } >
          <IonLabel>{tag.name}</IonLabel>
          <IonIcon slot="end" src={close} onClick={() => removeTag(tag)} />
      </TagItem>
    )
  })

  function handleAddTag(tagName){
    dispatch( addPostTag( tagName ) )
    setInputText("")
  }

  return (
    <>
      <IonRow>
        <IonCol>
          <IonItem  >
            <TagsList >
              {tagComponents.length > 0 ?
                tagComponents
              :
                <MissingTagsLabel >No Tags Have Been Added Yet </MissingTagsLabel>
              }
            </TagsList>
          </IonItem>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol>
          <IonLabel>
            Suggestions:
          </IonLabel>
          <IonItem  >
            <TagsList >
              {(inputText.length >= 2 && suggestionComponents.length > 0) &&
                suggestionComponents
              }
              { inputText.length < 2 &&
                <IonNote>
                  Begin Typing Above for Suggestions
                </IonNote>
              }
              { (inputText.length >= 2 && suggestionComponents.length === 0) &&
                <MissingTagsLabel> No Matches Found </MissingTagsLabel>
              }
            </TagsList>
          </IonItem>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol>
          <IonItem>
          <TagLabel position="floating" >
            Tags
          </TagLabel>
            <InputArea
              type="text"
              value={inputText}
              onKeyUp={event => addTags(event)}
              placeholder="Press space or enter to add tags"
            />         
          </IonItem>
        </IonCol>
      </IonRow>

  </>
  );
}

export default TagInput

const TagsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin-top: 7px;
  margin-bottom: 7px;
`
const TagItem = styled(IonItem)`
  border: 1px solid;
  border-radius: 10px;
  cursor: pointer;
  ::part(native){
    min-height: 35px;
    height: 25px;
    
  }
  ion-label{
    padding: 0;
    margin: 0;
  }
`

const MissingTagsLabel = styled(IonNote)``

const TagLabel = styled(IonLabel)`
  &&{
    margin-bottom: 12px;
  }
`
const InputArea = styled(IonInput)``

const TagSuggestionsPopover = styled(IonPopover)``