import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { IonList } from '@ionic/react'
import styled from 'styled-components'

function FileDrop(){
  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log(acceptedFiles)
    },
    []
  )

  const { isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles } = useDropzone({
    onDrop,
    accept: 'image/*',
    minSize: 0,
  });

  return (
    <>
      <DropArea {...getRootProps() } >
        <input {...getInputProps() } />
        {!isDragActive && 'Click here or drop a file to upload!'}
        {isDragActive && !isDragReject && "Drop it like it's hot!"}
        {isDragReject && "File type not accepted, sorry!"}
        
        <IonList>
          {acceptedFiles.length > 0 && 
            acceptedFiles.map( (acceptedFile, index) => {
              <li key={index} > {acceptedFile} </li>
            })
          }
        </IonList>
      </DropArea>
    </>
  )
}

export default FileDrop


const DropArea = styled.div`
  background: pink;
  width: 100%;
  height: 200px;
`