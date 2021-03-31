import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonLabel} from '@ionic/react';
import { IonCard, IonCardContent, IonAvatar, IonItem, IonInput } from '@ionic/react';
import { IonRow, IonCol, IonTextarea, IonGrid, IonButton, IonToast } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentUser } from '../redux/userSlice'
import { setProfileUser } from '../redux/profileSlice'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDropzone } from 'react-dropzone';
import { useStorage } from '@ionic/react-hooks/storage'
import { useForm, Controller, get } from "react-hook-form";
import styled from 'styled-components'
import avatarPlaceHolder from '../assets/avatar.jpg'
import meshGradient from '../assets/meshGradient.png'
import meshGradientDark from '../assets/meshGradientDark.png'
import dronePiece from '../assets/dronePiece.png'
import namePiece from '../assets/namePiece.png'


//********************************************************************* */
//******************* DropZone Component ****************************** */
//********************************************************************* */

export function Droparea(props) {
  const currentUser = useSelector(state => state.currentUser)
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
            <img 
              src={currentUser?.avatar?.secure_url ? currentUser.avatar.secure_url : avatarPlaceHolder} 
              alt={currentUser.username}
            />
          </Thumbnail>
        }
        <input {...getInputProps()} />
        <DropItem>
          <IonLabel>Drag or Select Photo</IonLabel>
        </DropItem>
      </DropArea>
  );
}

//********************************************************************* */
//********************** Edit Profile  Form *************************** */
//********************************************************************* */


function EditProfilePage () {
  const currentUser = useSelector(state => state.currentUser)
  const { register, handleSubmit, errors, control, clearErrors, getValues } = useForm({
    defaultValues: {
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      bio: currentUser.bio,
      email: currentUser.email,
      phone: currentUser.phone,
      password: "",
      new_password: "",
      password_confirmation: ""
    }
  });  

  const [ isUploading, setIsUploading ] = useState(false)
  const [ networkErrors, setNetworkErrors ] = useState([])
  const { get } = useStorage()
  const dispatch = useDispatch()
  const history = useHistory()

  function goToProfile(){
    history.push(`/users/${currentUser.username}`)
  }

  function handleSaveClick(formData){
    setIsUploading(true)
    if (formData.avatar === avatarPlaceHolder) {
      saveChangesWithoutPhoto(formData)
    } else {
      uploadAndSave(formData)
    }
  }

//********************************************************************* */
//******** Post Avatar(s) to Cloudinary Then Save to DB *************** */
//********************************************************************* */
  async function uploadAndSave(formData){
    get("token")
      .then( token => {
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
              const {bio, first_name, last_name, phone, email, password, new_password} = formData
              const newUserData = { bio, first_name, last_name, phone, email, password, new_password,
                avatar: JSON.stringify(avatarData) 
              }

              const patchUserConfig = {
                method: "PATCH",
                headers:{
                  "Content-type":"application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newUserData)
              }
              
              fetch(`${process.env.REACT_APP_BACKEND}/users/${currentUser.id}`, patchUserConfig)
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  return response.json().then((data) => {
                    throw data;
                  });
                }
              })
              .then((updatedUser) => {
                setIsUploading(false)
                dispatch( setCurrentUser( updatedUser ) )
                dispatch( setProfileUser( updatedUser ))
                history.push(`/users/${updatedUser.username}`)
              })
              .catch((data) => {
                console.log(`data.errors`, data)
                // setNetworkErrors(data.errors);
              });
            } 
        })
      })
  }

//********************************************************************* */
//******** Post Save to DB and Ignore Avatar Placeholder ************** */
//********************************************************************* */

function saveChangesWithoutPhoto(formData){
  get("token")
    .then( token => {
      const {bio, first_name, last_name, phone, email, password, new_password} = formData
      const newUserData = { bio, first_name, last_name, phone, email, password, new_password}

      const patchUserConfig = {
        method: "PATCH",
        headers:{
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newUserData)
      }
      // debugger
      fetch(`${process.env.REACT_APP_BACKEND}/users/${currentUser.id}`, patchUserConfig)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then((data) => {
              throw data;
            });
          }
        })
        .then((updatedUser) => {
          setIsUploading(false)
          dispatch( setCurrentUser( updatedUser ) )
          dispatch( setProfileUser( updatedUser ) )
          history.push(`/users/${updatedUser.username}`)

        })
        .catch((data) => {
          setNetworkErrors(data.errors);
        });
    })
}






  // function handleCancelClick(){
  //   history.push(`/users/${currentUser.username}`)
  // }

  return (
    <IonPage>
        <Header >
          <Toolbar>
            <Item>
              {/* <Title slot="start">
                Dronie
              </Title> */}
              <HeaderRow>
                <HeaderCol>
                  <LogoImage src={dronePiece} />
                </HeaderCol>
                <HeaderCol>
                  <NameImage src={namePiece} />
                </HeaderCol>
                <HeaderCol>
                  <Avatar  onClick={goToProfile}>
                    <img src={currentUser.avatar.secure_url} alt={currentUser.username}/>
                  </Avatar>
                </HeaderCol>
              </HeaderRow>
            </Item>
          {/* <Toolbar>
            <Item>
              <Title slot="start">Dronie</Title>
              <Avatar slot="end" onClick={goToProfile}>
                <img src={currentUser.avatar.secure_url}/>
              </Avatar>
            </Item> */}
          </Toolbar>
        </Header>

      <PageContent fullscreen>
            <Container>
              <Card>
                <Content> 

                  <Form onSubmit={handleSubmit(handleSaveClick)} >
                    <SignupGrid>
                      <IonRow>
                        <IonCol>
                          <Controller control={control} name="avatar" 
                            defaultValue={avatarPlaceHolder}
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
                        <IonCol > 
                          <IonItem>
                            <InputLabel position="floating">
                              Current Password *
                            </InputLabel>
                            <IonInput type="password" name="password" placeholder="Current Password" 
                              ref={register({
                                required: {value: true, message: "Please enter your current password"},
                                })} 
                            />
                          </IonItem>
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol > 
                          <IonItem>
                            <InputLabel position="floating">
                              New Password <em>(Optional)</em>
                            </InputLabel>
                            <IonInput type="password" name="new_password" placeholder="Enter New Password" 
                              ref={register} 
                            />
                          </IonItem>
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol > 
                          <IonItem>
                            <InputLabel position="floating">
                              Confirm New Password
                            </InputLabel>
                            <IonInput type="password" name="password_confirmation" placeholder="Confirm New Password" 
                              ref={register({
                                required: {value: !!getValues().new_password, message: "Confirm new password"},
                                validate: {passwordsMatch: value => (value === getValues().new_password) || "New passwords must match"} })} 
                            />
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
                        {/* <Col >
                          <IonButton color="primary" size="small" type="cancel" 
                            disabled={isUploading}
                            onClick={handleCancelClick}
                          >
                            Cancel
                          </IonButton>
                        </Col> */}
                        <Col >
                          <IonButton color="success" size="small" type="submit" 
                            disabled={isUploading}
                          >
                            Save
                          </IonButton>
                        </Col>
                      </IonRow>
                    </SignupGrid>
                  </Form> 

                  {/* <IonButton color="primary" size="small" type="cancel" 
                    disabled={isUploading}
                    onClick={handleCancelClick}
                    slot="end"
                  >
                    Cancel
                  </IonButton> */}


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
      </PageContent>
    </IonPage>
  );
};

export default EditProfilePage;


const DropArea = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
  border: 2px dashed;
  border-radius: 8px;
`
const DropItem = styled(IonItem)`

`
const Thumbnail = styled(IonAvatar)`
  width: 120px;
  height: 120px;

  img {
    width: 100%;
    height: 100%;
  }
`
/**********************************************************/
const Header = styled(IonHeader)``

const Toolbar = styled(IonToolbar)`
  display: flex;
`

const HeaderRow = styled(IonRow)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const HeaderCol = styled(IonCol)`
  display: flex;
  justify-content: center;
`

const LogoImage = styled.img`
  height: 35px;
`
const NameImage = styled.img``

const Avatar = styled(IonAvatar)`
    width:50px !important;
    height: 50px !important;
    border: 1px solid;
    cursor: pointer;
    /* margin-right: 3vw; */
`
const Item = styled(IonItem)`
  /* --border-color: transparent; */
  --background: none;
  background-image: url(${meshGradient});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  @media (prefers-color-scheme: dark) {
    background-image: url(${meshGradientDark});
  }
` 

/********************************************************** */

const PageContent = styled(IonContent)`
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

const Container = styled.div`
  display: flex;
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

`
const Content = styled(IonCardContent)``

const Form = styled.form``

const SignupGrid = styled(IonGrid)``

const Col = styled(IonCol)`
  display: flex;
  align-items: center;
  justify-content: center;
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
