import { useForm, Controller } from "react-hook-form";
import { useSelector } from 'react-redux'
import { IonInput, IonLabel, IonItem, IonCard, IonCardContent, IonThumbnail } from "@ionic/react"
import { IonButton, IonTextarea, IonGrid, IonRow, IonCol } from "@ionic/react"
import styled from 'styled-components'
import {useDropzone} from 'react-dropzone';


export function Basic(props) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    maxFiles: 5,
    onDrop: props.onChange,
    multiple: true
  });
  
  const files = acceptedFiles.map(file => (
    <Thumbnail key={file.path}>
      <img src={URL.createObjectURL(file)} />
    </Thumbnail>
  ));

  return (
    <DropArea >
      <PhotoPreviewsContainer>
        {files}
      </PhotoPreviewsContainer>
      <Item {...getRootProps()}>
        <input {...getInputProps()} />
        <IonLabel>Drag images here, or Click to select files</IonLabel>
      </Item>
    </DropArea>
  );
}



function NewPostForm() {
  const user = useSelector(state => state.user)
  
  const { register, handleSubmit, errors, control } = useForm();  
  
  function onSubmit (formData){
    uploadPhotos(formData)
  } 

  console.log(`process.env.REACT_APP_CLOUD_NAME`, process.env.REACT_APP_UPLOAD_PRESET)
  
  function uploadPhotos(formData){
    // const url = `https://api.cloudinary.com/v1_1/******/upload`
    
    const imageFiles = new FormData()
    for (let photo of formData.images){
      imageFiles.append("file", photo)
      // imageFiles.append("upload_preset", "")

      const uploadConfig = {
        method: "POST",
        body: imageFiles
      }

      fetch(url, uploadConfig)
        .then( response => response.json())
        .then( console.log )
    }
  }



  return (
    <Card>
      <Content>

          <Form onSubmit={handleSubmit(onSubmit)}>
              
            <Controller control={control} name="images" rules={{required:true}} defaultValue={[]}
              render={({ onChange, onBlur, value, ref }) => (
                <Basic onBlur={onBlur} onChange={(e) => onChange(e)} checked={value} inputRef={ref}
                />
              )}
            />

            <IonInput type="hidden" name="user_id" value={user.login.uuid} ref={register} />

            <IonItem >
              <CalLabel position="floating">
                Date Taken
              </CalLabel>
              <IonInput type="date" name="date_taken" ref={register} />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">
                Location
              </IonLabel>
              <IonInput type="text" name="location" ref={register} />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">
                Description
              </IonLabel>
              <IonTextarea name="description" ref={register} />
            </IonItem>

            {errors.images && 
              <ErrorItem>
                <IonLabel>You must select choose a photo</IonLabel>
              </ErrorItem>
            }
            <IonGrid>
              <IonRow>
                <Col >
                  <IonButton type="submit" >
                    Post
                  </IonButton>
                </Col>
              </IonRow>
            </IonGrid>
          </Form> 

      </Content>
    </Card>
  )
}

export default NewPostForm

const Card = styled(IonCard)``

const Content = styled(IonCardContent)``

const Form = styled.form``

const DropArea = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
  border: 2px dashed;
  border-radius: 8px;
`
const PhotoPreviewsContainer = styled.div`
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`

const Thumbnail = styled(IonThumbnail)`
  width: 30%;
  height: auto;
  img {
    height: 100%;
    width: 100%auto;
  }
`

const Item = styled(IonItem)`
  && {
    text-align:center;
    --background: transparent;
  }
`

const CalLabel = styled(IonLabel)`
  &&{
    margin-bottom: 12px;
  }
`
const ErrorItem = styled(Item)`
  --border-color: transparent;
`

const Col = styled(IonCol)`
  display: flex;
  align-items: center;
  justify-content: center;
`