import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonImg, IonAvatar } from '@ionic/react';
import {IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/react'
import './Tab3.css';
import { useState, useEffect } from 'react'
import {useSelector} from 'react-redux'



const Search: React.FC = () => {
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState(false)
  const [items, setItems] = useState([])
  const [isfetching, setIsfetching] = useState(false)
  const currentUser = useSelector(state => state.currentUser)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    if (isfetching) return
    setIsfetching(true)
    
    const url = 'https://dog.ceo/api/breeds/image/random/10';
    const res = await fetch(url);
    res.json()
        .then(async (res) => {
          if (res && res.message && res.message.length > 0) {
            setItems([...items, ...res.message]);
            setDisableInfiniteScroll(res.message.length < 10);
          } else {
            setDisableInfiniteScroll(true);
          }
          setIsfetching(false)
        })
        .catch(error => {
          setIsfetching(false)
          console.error(error)
        });
  }

  async function searchNext(event) {
    await fetchData();
    (event.target).complete();
  }

  return (
    <IonPage >
        <IonHeader >
          <IonToolbar>
            <IonTitle slot="start">Dronie</IonTitle>
            <IonAvatar slot="end">
              <img src={currentUser.avatar.secure_url}/>
            </IonAvatar>
          </IonToolbar>
        </IonHeader>

      <IonContent >

        {
          items.map( (item, index) => {
            return (
            <IonCard key={index}>
              <IonImg src={item} />
            </IonCard>
            )
          })
        }
        
        <IonInfiniteScroll 
          threshold="50%" 
          disabled={disableInfiniteScroll}
          onIonInfinite={searchNext}
        >
          <IonInfiniteScrollContent
            loadingText="Loading more good doggos...">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>




      </IonContent>

    </IonPage>
  );
};

export default Search;
