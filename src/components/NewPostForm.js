import { useForm, Controller } from "react-hook-form";
import { IonInput, IonLabel, IonItem, IonCard, IonCardContent, IonThumbnail } from "@ionic/react"
import { IonButton, IonTextarea, IonGrid, IonRow, IonCol, IonToast } from "@ionic/react"
import styled from 'styled-components'
import {useDropzone} from 'react-dropzone';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUsersPosts } from '../redux/userSlice'
import { useStorage } from '@ionic/react-hooks/storage'

export function Basic(props) {
  const [ files, setFiles ] = useState()
  const user = useSelector(state => state.user)
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    maxFiles: 5,
    onDrop: props.onChange,
    multiple: true
  });
  
  // useEffect( () => {
  //   const newFiles = acceptedFiles.map(file => (
  //       <Thumbnail key={file.path}>
  //         <img src={URL.createObjectURL(file)} />
  //       </Thumbnail>
  //     ));
  //   setFiles(newFiles)  
  // }, [acceptedFiles])

  
  // useEffect(() => {
  //   setFiles([])
  // }, [user])

  return (
    <DropArea >
      <PhotoPreviewsContainer>
        {files}
      </PhotoPreviewsContainer>
      <Item {...getRootProps()}>
        <input {...getInputProps()} />
        <IonLabel>
          Drag images here, or Click to select files
        </IonLabel>
      </Item>
        {/* <button type="button" onClick={ () => remove() } >Reset</button> */}
    </DropArea>
  );
}



function NewPostForm() {
  const currentUser = useSelector(state => state.currentUser)
  const { register, handleSubmit, errors, control, reset, clearErrors } = useForm({
    defaultValues: {
      images: [],
      date_take: "",
      location: "",
      description: ""
    }
  });  
  const [isUploading, setIsUploading] = useState(false)
  const [ networkErrors, setNetworkErrors ] = useState([])
  const dispatch = useDispatch()
  const { get } = useStorage()


  function onSubmit (formData, e){

    reset({
      images: [],
      date_take: "",
      location: "",
      description: ""
    })

    setIsUploading(true)
    uploadAndSave(formData)
    
  } 


  //********************************************************************* */
  //******** Post Avatar(s) to Cloudinary Then Save to DB *************** */
  //********************************************************************* */

  async function uploadAndSave(formData){
    const numPhotos = formData.images.length
    const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`
    const imageData = []
    get("token")
      .then( token => {
        if (!token) return

        formData.images.forEach(async (photo, index) => {
            const imageFiles = new FormData()
            imageFiles.append("file", photo)
            imageFiles.append("upload_preset", `${process.env.REACT_APP_UPLOAD_PRESET}`)
            
            const uploadConfig = {
              method: "POST",
              body: imageFiles
            }
            
            const response = await fetch(url, uploadConfig)
            const data = await response.json()
            await imageData.push(data)
            
            if (imageData.length === numPhotos){
              const objWithPhotos = {...formData, images: JSON.stringify(imageData) }
              const postConfig = {
                method: "POST",
                headers:{
                  "Content-type":"application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(objWithPhotos)
              }
              fetch(`${process.env.REACT_APP_BACKEND}/posts/new`, postConfig)
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
                setIsUploading(false)
                dispatch( updateUsersPosts( data ) )
              })
              .catch((data) => {
                setNetworkErrors(data.errors);
              });
            } 
        })
      })
  }

  console.log(`currentUser`, currentUser)

  return (
    <Card>
      <Content>

          <Form onSubmit={handleSubmit(onSubmit)}>
              
            <Controller control={control} name="images" rules={{required:true, validate: value => value.length > 0}} defaultValue={[]}
              render={({ onChange, onBlur, value, ref }) => (
                <Basic onBlur={onBlur} onChange={(e) => onChange(e)} checked={value} inputRef={ref}
                />
              )}
            />

            <IonInput type="hidden" name="user_id" value={currentUser.id} ref={register} />

            <IonItem >
              <CalLabel position="floating">
                Date Taken
              </CalLabel>
              <IonInput type="date" name="date_taken" ref={register} />
            </IonItem>

            <IonItem>
              <CalLabel position="floating">
                Location
              </CalLabel>
              <IonInput type="text" name="location" ref={register} />
            </IonItem>

            <IonItem>
              <CalLabel position="floating">
                Description
              </CalLabel>
              <IonTextarea name="description" placeholder="Tell us about the shot!" ref={register} />
            </IonItem>

            <IonGrid>
              <IonRow>
                <Col >
                  <IonButton type="submit" disabled={isUploading}>
                    Post
                  </IonButton>
                </Col>
              </IonRow>
            </IonGrid>
          </Form> 

          <Toast
            isOpen={Object.keys(errors).length > 0}
            message={ 
              Object.keys(errors).reduce( (string, key) => {
                return `${string}${errors[key].message}.\n`
              }, '')
            }
            duration={1500}
            position="middle"
            header="Error :"
            color="danger"
            onDidDismiss={()=> clearErrors() }
            buttons= {[{
              text: 'Done',
              role: 'cancel',
            }]}
          />

          <Toast
            isOpen={networkErrors.length > 0}
            message={ 
              networkErrors.reduce( (string, error) => {
                return `${string}${error}.\n`
              }, '')
            }
            duration={1500}
            position="middle"
            header="Error :"
            color="danger"
            onDidDismiss={()=> {
              clearErrors() 
              setNetworkErrors([])
              setIsUploading(false)
            }}
            buttons= {[{
              text: 'Done',
              role: 'cancel',
            }]}
          />

      </Content>
    </Card>
  )
}

export default NewPostForm

const Card = styled(IonCard)``

const Content = styled(IonCardContent)`

`

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
    width: 100%;
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

const Toast = styled(IonToast)`
  &::part(message) {
    background-color: green;
  }

`

const Col = styled(IonCol)`
  display: flex;
  align-items: center;
  justify-content: center;
`