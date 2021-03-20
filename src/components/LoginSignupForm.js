import { useForm, Controller } from "react-hook-form";
import { IonInput, IonLabel, IonItem, IonCard, IonCardContent, IonAvatar } from "@ionic/react"
import { IonButton, IonTextarea, IonGrid, IonRow, IonCol, IonToast } from "@ionic/react"
import { IonSegment, IonSegmentButton } from '@ionic/react'
import styled from 'styled-components'
import {useDropzone} from 'react-dropzone';
import { useState } from 'react'
import avatarPlaceHolder from '../assets/avatar.jpg'
import { uploadAndSave } from '../hooks/useUploadAndSave'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../redux/userSlice'

//********************************************************************* */
//******************* DropZone Component ****************************** */
//********************************************************************* */

export function Droparea(props) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: props.onChange,
    multiple: false
  });
  
  const files = acceptedFiles.map(file => (
    <Thumbnail key={file.path}>
      <img src={URL.createObjectURL(file)} />
    </Thumbnail>
  ));

  return (
      <DropArea {...getRootProps()}>
        {files.length > 0 ?
          files :
          <Thumbnail>
            <img src={avatarPlaceHolder} />
          </Thumbnail>
        }
        <input {...getInputProps()} />
        <Item>
          <IonLabel>Drag Profile Image Here, or Click To Select</IonLabel>
        </Item>
      </DropArea>
  );
}
//********************************************************************* */
//******************* Login and Signup Form *************************** */
//********************************************************************* */

function LoginSignupForm() {
  const { register, handleSubmit, errors, control, watch, clearErrors, getValues } = useForm();  
  const dispatch = useDispatch()
  const [isUploading, setIsUploading] = useState(false)
  const [showLogin, setShowLogin] = useState(true)

  function toggleFormDisplay(formToShow){
    setShowLogin( formToShow === "login")
    clearErrors()
  }

  function onSignup (formData){
    setIsUploading(true)
    uploadPhotos(formData)
  } 
  
  function uploadPhotos(formData){
    console.log(`formData`, formData)
    if (formData.avatar === avatarPlaceHolder) {
      saveUser(formData)
      setIsUploading(false)
    } else {
      uploadAndSave(formData)
      setIsUploading(false)
    }
  }
  
//********************************************************************* */
//******** Post Avatar(s) to Cloudinary Then Save to DB *************** */
//********************************************************************* */

  async function uploadAndSave(formData){
    const numPhotos = formData.avatar.length
    const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`
    const avatarData = []
    
    formData.avatar.forEach(async (photo, index) => {
        const imageFiles = new FormData()
        imageFiles.append("file", photo)
        imageFiles.append("upload_preset", `${process.env.REACT_APP_UPLOAD_PRESET}`)
        
        const uploadConfig = {
          method: "POST",
          body: imageFiles
        }
        
        const response = await fetch(url, uploadConfig)
        const data = await response.json()
        await avatarData.push(data)
        
        if (avatarData.length === numPhotos){
          const objWithPhotos = {...formData, avatar: JSON.stringify(avatarData) }
          const postConfig = {
            method: "POST",
            headers:{
              "Content-type":"application/json"
            },
            body: JSON.stringify(objWithPhotos)
          }
          
          fetch(`${process.env.REACT_APP_BACKEND}/signup`, postConfig)
            .then( response => response.json() )
            .then( data => {
              dispatch( setCurrentUser( data.user) )
            })
        } 
    })
  }

//********************************************************************* */
//******** Post Save to DB and Ignore Avatar Placeholder ************** */
//********************************************************************* */
  
  function saveUser(formData){
    const newUser = {...formData, avatar: null}

    const postConfig = {
      method: "POST",
      headers:{
        "Content-type":"application/json"
      },
      body: JSON.stringify(newUser)
    }

    fetch(`${process.env.REACT_APP_BACKEND}/signup`, postConfig)
            .then( response => response.json() )
            .then( data => {
              dispatch( setCurrentUser( data.user) )
            })
  }

  
  function onLogin(formData){
    console.log(`formData`, formData)
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  console.log(`errors`, errors)

  return (
    <Card>
      <Content>
        <IonSegment onIonChange={e => toggleFormDisplay(e.detail.value) } value={showLogin ? "login" : "signup"}>
          <IonSegmentButton value="login">
            <IonLabel>Login</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="signup">
            <IonLabel>Signup</IonLabel>
          </IonSegmentButton>
        </IonSegment>

{/* ******************************************************************** */}
{/* ******* Form Components ******************************************** */}
{/* ******************************************************************** */}


        {showLogin ? 
          <LoginForm onSubmit={handleSubmit(onLogin)}>
            <LoginGrid >

              <IonRow>
                <IonCol > 
                  <IonItem>
                    <InputLabel position="floating">
                      Username *
                    </InputLabel>
                    <IonInput type="text" name="username" placeholder="First Name" 
                      ref={register({
                        required: {value: true, message:"Please enter a username"}
                        })} 
                      />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol > 
                  <IonItem>
                    <InputLabel position="floating">
                      Password *
                    </InputLabel>
                    <IonInput type="password" name="password" placeholder="Password" 
                      ref={register({
                        required: {value: true, message: "Please enter a password"},
                        validate: {passwordsMatch: value => (value === getValues().password_confirmation) || "Passwords must match"} })} 
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <Col >
                  <IonButton type="submit" disabled={isUploading}>
                    Login
                  </IonButton>
                </Col>
              </IonRow>

            </LoginGrid>
          </LoginForm>

// ************************************************************
        : //************ Sign Up Form *************************
// ************************************************************


          <SignupForm onSubmit={handleSubmit(onSignup)} showLogin={showLogin}>
            <SignupGrid>
              <IonRow>
                <IonCol>
                  <Controller control={control} name="avatar" rules={{required: {value: true, message:"required"}}} defaultValue={avatarPlaceHolder}
                    render={({ onChange, onBlur, value, ref }) => (
                      <Droparea onBlur={onBlur} onChange={(e) => onChange(e)} checked={value} inputRef={ref}/>
                    )}
                  />
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <IonItem>
                    <InputLabel position="floating">
                      About You
                    </InputLabel>
                    <IonTextarea name="bio" placeholder="Tell us about yourself!" ref={register} />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol > 
                  <IonItem>
                    <InputLabel position="floating">
                      Username *
                    </InputLabel>
                    <IonInput type="text" name="username" placeholder="First Name" 
                      ref={register({
                        required: {value: true, message:"Please enter a username"}
                        })} 
                      />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol > 
                  <IonItem>
                    <InputLabel position="floating">
                      Password *
                    </InputLabel>
                    <IonInput type="password" name="password" placeholder="Password" 
                      ref={register({
                        required: {value: true, message: "Please enter a password"},
                        validate: {passwordsMatch: value => (value === getValues().password_confirmation) || "Passwords must match"} })} 
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol > 
                  <IonItem>
                    <InputLabel position="floating">
                      Confirm Password *
                    </InputLabel>
                    <IonInput type="password" name="password_confirmation" placeholder="Confirm Password" 
                      ref={register({
                        required: {value: true, message: "Passwords must match"},
                        validate: {passwordsMatch: value => (value === getValues().password) || "Passwords must match"} })} 
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol >
                  <IonItem>
                    <InputLabel position="floating">
                      First Name 
                    </InputLabel>
                    <IonInput type="text" name="first_name" placeholder="First Name" ref={register} />
                  </IonItem>
                </IonCol>

                <IonCol>
                  <IonItem>
                    <InputLabel position="floating">
                      Last Name 
                    </InputLabel>
                    <IonInput type="text" name="last_name" placeholder="Last Name" ref={register} />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <IonItem>
                    <InputLabel position="floating">
                      Phone 
                    </InputLabel>
                    <IonInput type="tel" placeholder="Phone Number" name="phone" 
                      ref={register({
                        minLength: {value: 6, message:"Please enter a valid number"},
                        maxLength: {value: 12, message: "Please enter a valid number"}
                      })}  
                    />
                  </IonItem>
                </IonCol>
                
                <IonCol>
                  <IonItem>
                    <InputLabel position="floating">
                      Email 
                    </InputLabel>
                    <IonInput type="text" placeholder="Email" name="email" 
                      ref={register({
                        pattern: {value: /^\S+@\S+$/i, message:"Please enter a valid email"}
                      })}   
                    />
                  </IonItem>
                </IonCol>
              </IonRow>



                <IonRow>
                  <Col >
                    <IonButton type="submit" disabled={isUploading}>
                      Signup
                    </IonButton>
                  </Col>
                </IonRow>
            </SignupGrid>
          </SignupForm> 
          }

          <Toast
              isOpen={Object.keys(errors).length > 0}
              message="Select atleast one photo"
              duration={1000}
              position="middle"
              header="Error :"
              color="danger"
              onDidDismiss={()=> clearErrors() }
            />

      </Content>
    </Card>
  )
}

export default LoginSignupForm

const Card = styled(IonCard)``

const Content = styled(IonCardContent)``

const SignupForm = styled.form``

const SignupGrid = styled(IonGrid)``

const LoginForm = styled.form``
const LoginGrid = styled(IonGrid)``

const Col = styled(IonCol)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const DropArea = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
  border: 2px dashed;
  border-radius: 8px;
`

const Thumbnail = styled(IonAvatar)`
  width: 120px;
  height: 120px;

  img {
    width: 100%;
    height: 100%;
  }
`

const Item = styled(IonItem)`
  && {
    text-align:center;
    --background: transparent;
  }
`

const InputLabel = styled(IonLabel)`
  &&{
    margin-bottom: 12px;
  }
`





const Toast = styled(IonToast)`
  &::part(message) {
    background-color: green;
  }

`