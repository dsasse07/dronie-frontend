

// export async function uploadAndSave(formData){
//   const numPhotos = formData.avatar.length
//   const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`
//   const avatarData = []
  
//   formData.avatar.forEach(async (photo, index) => {
//       const imageFiles = new FormData()
//       imageFiles.append("file", photo)
//       imageFiles.append("upload_preset", `${process.env.REACT_APP_UPLOAD_PRESET}`)
      
//       const uploadConfig = {
//         method: "POST",
//         body: imageFiles
//       }
      
//       const response = await fetch(url, uploadConfig)
//       const data = await response.json()
//       await avatarData.push(data)
      
//       if (avatarData.length === numPhotos){
//         const objWithPhotos = {...formData, avatar: JSON.stringify(avatarData) }
//         const postConfig = {
//           method: "POST",
//           headers:{
//             "Content-type":"application/json"
//           },
//           body: JSON.stringify(objWithPhotos)
//         }
        
//         return fetch(`${process.env.REACT_APP_BACKEND}/signup`, postConfig)
//           .then( response => response.json() )
          
//       } 
//   })
// }
