import { useForm, Controller } from "react-hook-form";
import { IonInput, IonLabel, IonItem } from "@ionic/react"
import { IonButton, IonGrid, IonRow, IonCol, IonToast } from "@ionic/react"
import styled from 'styled-components'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../redux/userSlice'

function LoginForm() {
  const { register, handleSubmit, errors, clearErrors, getValues } = useForm();  
  const [isUploading, setIsUploading] = useState(false)
  const dispatch = useDispatch()

  function onLogin(formData){
    console.log(`Login formData`, formData)
  }

  console.log(`Login errors`, errors)

  return (
    <>
      <Form onSubmit={handleSubmit(onLogin)}>
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
                  })} 
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
    </>
  )
}

export default LoginForm




const Form = styled.form``
const LoginGrid = styled(IonGrid)``

const Col = styled(IonCol)`
  display: flex;
  align-items: center;
  justify-content: center;
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