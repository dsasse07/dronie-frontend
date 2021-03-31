import { IonInput, IonLabel, IonItem, IonCard, IonCardContent, IonThumbnail } from "@ionic/react"
import { IonButton, IonTextarea, IonGrid, IonRow, IonCol, IonToast } from "@ionic/react"
import { IonLoading, useIonViewDidLeave } from "@ionic/react"
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateProfilePosts } from '../redux/profileSlice'
import { addPost } from '../redux/postsSlice'
import { useStorage } from '@ionic/react-hooks/storage'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import uploadPlaceholder from '../assets/uploadPlaceholder.png'
import TagInput from '../components/TagInput'
import { clearPostTags } from "../redux/postFormSlice";
import meshGradient from '../assets/meshGradient.png'
import meshGradientDark from '../assets/meshGradientDark.png'

export function Basic(props) {
  const [ files, setFiles ] = useState()
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    maxFiles: 5,
    onDrop: props.onChange,
    multiple: true
  });
  
  useEffect( () => {
    const newFiles = acceptedFiles.map( (file, index) => (
        <Thumbnail key={file.path}>
          <img src={URL.createObjectURL(file)} alt={`Image ${index+1}`}/>
        </Thumbnail>
      ));
    setFiles(newFiles)  
  }, [acceptedFiles])

  // Clear the file previews when the user is updated after the post is uploaded.
  useEffect(() => {
    setFiles([])
    dispatch( clearPostTags([]) )
  }, [currentUser])

  useIonViewDidLeave( () => {
    setFiles([])
    dispatch( clearPostTags([]) )
  })

  return (
    <DropArea {...getRootProps()}>
      <PhotoPreviewsContainer>
        {files}
        {files?.length === 0 &&
          <Placeholder >
            <img src={uploadPlaceholder} alt="placeholder"/>
          </Placeholder>
        }
      </PhotoPreviewsContainer>
      <input {...getInputProps()} />
      <Item >
        <IonLabel>
          Drag images here, or Click to select files
        </IonLabel>
      </Item>
    </DropArea>
  );
}



function NewPostForm() {
  const currentUser = useSelector(state => state.currentUser)
  const postForm = useSelector(state => state.postForm)
  // const tags = useSelector(state => state.tags)
  const { register, handleSubmit, errors, control, reset, clearErrors, setValue } = useForm({
    defaultValues: {
      images: [],
      date_take: "",
      location: "",
      description: ""
    }
  });  
  const [ isUploading, setIsUploading ] = useState(false)
  const [ networkErrors, setNetworkErrors ] = useState([])
  const dispatch = useDispatch()
  const history = useHistory()
  const { get } = useStorage()


  function onSubmit (formData, e){
    formData.tags = postForm.tags
    reset({
      images: [],
      date_take: "",
      location: "",
      description: ""
    })
    dispatch( clearPostTags([]) )
    setIsUploading(true)
    uploadAndSave(formData)
  } 

  useIonViewDidLeave( () => {
    reset({
      images: [],
      date_take: "",
      location: "",
      description: ""
    })
  })

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
                dispatch( addPost( data ) )
                dispatch( updateProfilePosts( data ))
                history.push(`/users/${currentUser.username}`)
              })
              .catch((data) => {
                setNetworkErrors(data.errors);
              });
            } 
        })
      })
  }

  return (
    <>
    <IonLoading
      isOpen={isUploading}
      message={'Posting...'}
    />
    <Container>
      <Card>
        <Content>

            <Form onSubmit={handleSubmit(onSubmit)}>
                
              <Controller control={control} name="images" 
                rules={{
                  required:true, 
                  validate: value => value.length > 0 || "Select at least one photo"
                }} 
                defaultValue={[]}
                render={({ onChange, onBlur, value, ref }) => (
                  <Basic onBlur={onBlur} onChange={(e) => onChange(e)} checked={value} inputRef={ref}
                  />
                )}
              />

              <IonInput type="hidden" name="user_id" value={currentUser.id} ref={register} />
              
              <IonGrid>
              
                <TagInput />

                <IonRow>
                  <IonCol>
                    <IonItem >
                      <CalLabel position="floating">
                        Date Taken
                      </CalLabel>
                      <IonInput type="date" name="date_taken" ref={register} />
                    </IonItem >
                  </IonCol>    
                </IonRow>
                
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <CalLabel position="floating">
                        Location
                      </CalLabel>
                      <IonInput type="text" name="location" ref={register} />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol>
                    <IonItem>
                      <CalLabel position="floating">
                        Description
                      </CalLabel>
                      <IonTextarea name="description" placeholder="Tell us about the shot!" ref={register} />
                    </IonItem>
                  </IonCol>
                </IonRow>

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
    </Container>
  </>
  )
}

export default NewPostForm

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

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

const Card = styled(IonCard)`
  display: grid;
  max-width: 95%;
`
const Content = styled(IonCardContent)``

const Form = styled.form`
`

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

const Placeholder = styled(IonThumbnail)`
  width: 30%;
  height: auto;
  img {
    opacity: 20%;
    height: 100%;
    width: 100%;
  }
`

const HiddenButton = styled.button`

`