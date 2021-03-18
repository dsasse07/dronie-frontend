import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux'
import { IonInput, IonLabel, IonItem, IonCard, IonCardContent, IonThumbnail } from "@ionic/react"
import styled from 'styled-components'
import FileDrop from '../components/FileDrop'

function NewPostForm() {
  const user = useSelector(state => state.user)
  
  const { register, handleSubmit, watch, errors } = useForm();  
  const onSubmit = data => console.log(data);

  console.log(watch("images")); // watch input value by passing the name of it


  return (
    <IonCard>
      <IonCardContent>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <IonItem> */}
              <FileDrop />
            {/* </IonItem> */}
            


            <IonInput type="hidden" name="user_id" value={user.login.uuid} ref={register} />


            <IonItem>
              <IonLabel>
                Description
              </IonLabel>
              <IonInput type="text" name="description" ref={register} />
            </IonItem>

            <IonItem>
              <IonLabel>
                Date Taken
              </IonLabel>
              <IonInput type="date" name="date_taken" ref={register} />
            </IonItem>

            <IonItem>
              <IonLabel>
                Location
              </IonLabel>
              <IonInput type="text" name="location" ref={register} />
            </IonItem>
            {errors.exampleRequired && <span>This field is required</span>}

            <input type="submit" />
          </form> 
        

    
          
      </IonCardContent>
    </IonCard>
  )
}

export default NewPostForm

const PhotoPreviewsContainer = styled.div``

