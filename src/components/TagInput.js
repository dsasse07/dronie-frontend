import { useState } from 'react'
import styled from 'styled-components'
import { close, add, chevronDownOutline } from 'ionicons/icons'
import { IonInput, IonLabel, IonItem, IonIcon } from "@ionic/react"
import { IonRow, IonCol, IonNote } from "@ionic/react"
import { useDispatch, useSelector } from 'react-redux'
import { addPostTag, removePostTag} from '../redux/postFormSlice'

function TagInput() {
  const postForm = useSelector(state => state.postForm)
  const tags = useSelector(state => state.tags)
  const [ inputText, setInputText ] = useState("")
  const dispatch = useDispatch()

  const addTags = event => {
    setInputText(event.target.value)
    if ( event.key === "Enter" && event.target.value !== "") {
      dispatch( addPostTag( inputText.trim() ) )
      setInputText("")
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
    return !postForm.tags.find( postTag => postTag === tag.name)
  })

  const filteredTags = unusedTags.filter( tag => {
    return tag.name.includes(inputText) 
  })

  const suggestionComponents = filteredTags.map( (tag, index) => {
    return (
      <TagItem key={index} onClick={ () => handleAddTag(tag.name) } >
          <IonLabel>{tag.name}</IonLabel>
          <IonIcon slot="end" src={add} />
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
          <IonRow>
            <IonCol>
              <SuggestionsLabel>
                Added Tags:
              </SuggestionsLabel>
            </IonCol>
          </IonRow>

          <IonRow>
            <TagsList >
              {tagComponents.length > 0 ?
                tagComponents
              :
                <MissingTagsLabel >No Tags Have Been Added Yet </MissingTagsLabel>
              }
            </TagsList>
          </IonRow>
        </IonCol>
      </IonRow>

      <SuggestionsRow>
        <IonCol>
          <IonRow>
            <IonCol>
              <SuggestionsLabel>
                Tag Suggestions:
              </SuggestionsLabel>
            </IonCol>
            <CenterCol>
              {(inputText.length >= 2 && suggestionComponents.length > 0) &&
                "Click to select"
              }
            </CenterCol>
            <IonCol></IonCol>
          </IonRow>

          <IonRow>
            <TagsList >
              {(inputText.length >= 2 && suggestionComponents.length > 0) &&
                suggestionComponents.slice(0,5)
              }
              { inputText.length < 2 &&
                <>
                  <BeginTypingNote>
                    <IonIcon icon={chevronDownOutline} />
                    Begin typing below for suggestions
                    <IonIcon icon={chevronDownOutline} />
                  </BeginTypingNote>
                </>
              }
              { (inputText.length >= 2 && suggestionComponents.length === 0) &&
                <MissingTagsLabel> 
                  No Matches Found 
                </MissingTagsLabel>
              }
            </TagsList>
          </IonRow>
        </IonCol>
      </SuggestionsRow>

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

const TagsList = styled(IonCol)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
const SuggestionsRow = styled(IonRow)`
`
const SuggestionsLabel = styled(IonLabel)`
  font-weight: bold;
`
const CenterCol = styled(IonCol)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const MissingTagsLabel = styled(IonNote)``

const TagLabel = styled(IonLabel)`
  &&{
    margin-bottom: 12px;
  }
`
const InputArea = styled(IonInput)``

const BeginTypingNote = styled(IonNote)`
  display: flex;
  align-items: center;
  gap: 6px;
`