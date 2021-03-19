import { useForm, Controller } from "react-hook-form";
import { useSelector } from 'react-redux'
import { IonInput, IonLabel, IonItem, IonCard, IonCardContent, IonThumbnail } from "@ionic/react"
import styled from 'styled-components'
import FileDrop from '../components/FileDrop'
import {useDropzone} from 'react-dropzone';

function NewPostForm() {
  const user = useSelector(state => state.user)
  
  const { register, handleSubmit, watch, errors, control } = useForm();  
  const onSubmit = data => console.log(data);

  console.log(watch("images")); // watch input value by passing the name of it



function Basic(props) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    maxFiles: 5,
    onDrop: props.onChange,
    multiple: true
  });
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}



  return (
    <IonCard>
      <IonCardContent>

          <form onSubmit={handleSubmit(onSubmit)}>
              
          <Controller
            control={control}
            name="images"
            render={(
              { onChange, onBlur, value, name, ref },
              { invalid, isTouched, isDirty }
            ) => (
              <Basic
                onBlur={onBlur}
                onChange={(e) => onChange(e)}
                checked={value}
                inputRef={ref}
              />
            )}
          />
              
              
              {/* <Basic /> */}
            


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

